import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE_URL || 'https://letmeteachyouai.com';
const ORIGIN = new URL(BASE).origin;
const MAX_PAGES = Number(process.env.QA_MAX_PAGES || 60);
const NAV_TIMEOUT = Number(process.env.QA_NAV_TIMEOUT || 15000);

const result = {
  startedAt: new Date().toISOString(),
  baseUrl: BASE,
  safety: {
    mutationRequestsBlocked: true,
    externalNavigationNotClicked: true,
    loadTestMethods: ['GET'],
    maxConcurrency: 20,
  },
  discovery: { sitemapUrls: [], crawledUrls: [] },
  viewports: {},
  load: {},
  summary: {},
};

const uniq = (xs) => [...new Set(xs)];
const sameOrigin = (url) => {
  try { return new URL(url, ORIGIN).origin === ORIGIN; } catch { return false; }
};
const cleanUrl = (url) => {
  const u = new URL(url, ORIGIN);
  u.hash = '';
  return u.toString();
};

async function discoverSitemap() {
  const candidates = [`${ORIGIN}/sitemap.xml`, `${ORIGIN}/sitemap-index.xml`];
  const urls = [];
  for (const candidate of candidates) {
    try {
      const r = await fetch(candidate, { redirect: 'follow', signal: AbortSignal.timeout(NAV_TIMEOUT) });
      if (!r.ok) continue;
      const text = await r.text();
      for (const m of text.matchAll(/<loc>(.*?)<\/loc>/g)) {
        const u = m[1].trim().replaceAll('&amp;', '&');
        if (sameOrigin(u)) urls.push(cleanUrl(u));
      }
    } catch {}
  }
  return uniq(urls);
}

async function checkUrl(url) {
  const started = performance.now();
  try {
    const r = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'LMTYAI-QA-Swarm/1.0' },
      signal: AbortSignal.timeout(NAV_TIMEOUT),
    });
    return { url, ok: r.ok, status: r.status, finalUrl: r.url, ms: Math.round(performance.now() - started) };
  } catch (e) {
    return { url, ok: false, status: 0, error: String(e), ms: Math.round(performance.now() - started) };
  }
}

async function crawlAndTest(viewportName, viewport, seedUrls) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport, userAgent: 'LMTYAI-QA-Swarm/1.0' });

  // Fail closed on writes. Button clicks may prove they try a POST, but the write never leaves the browser.
  await context.route('**/*', async (route) => {
    const method = route.request().method().toUpperCase();
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });

  const queue = uniq([cleanUrl(BASE), ...seedUrls]).slice(0, MAX_PAGES);
  const visited = new Set();
  const pages = [];

  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (!url || visited.has(url) || !sameOrigin(url)) continue;
    visited.add(url);

    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const badResponses = [];
    const blockedWrites = [];
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => pageErrors.push(String(err)));
    page.on('response', (resp) => { if (resp.status() >= 400) badResponses.push({ status: resp.status(), url: resp.url() }); });
    page.on('requestfailed', (req) => {
      const method = req.method().toUpperCase();
      if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) blockedWrites.push({ method, url: req.url() });
    });

    const rec = {
      url,
      nav: {},
      links: [],
      brokenLinks: [],
      buttons: [],
      unlabeledButtons: [],
      consoleErrors,
      pageErrors,
      badResponses,
      blockedWrites,
    };

    try {
      const navStart = performance.now();
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
      rec.nav = {
        status: response?.status() ?? 0,
        finalUrl: page.url(),
        ms: Math.round(performance.now() - navStart),
        title: await page.title(),
      };
      await page.waitForTimeout(300);

      const hrefs = await page.locator('a[href]').evaluateAll((els) => els.map((a) => ({
        href: a.href,
        text: (a.innerText || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 140),
      })));

      for (const link of hrefs) {
        if (!link.href || !sameOrigin(link.href)) continue;
        const target = cleanUrl(link.href);
        rec.links.push({ ...link, href: target });
        if (!visited.has(target) && queue.length + visited.size < MAX_PAGES) queue.push(target);
      }

      const sameSiteTargets = uniq(rec.links.map((l) => l.href)).slice(0, 120);
      const checked = await Promise.all(sameSiteTargets.map(checkUrl));
      rec.brokenLinks = checked.filter((x) => !x.ok || x.status >= 400);

      const controls = page.locator('button, [role="button"], input[type="submit"], input[type="button"]');
      const count = Math.min(await controls.count(), 80);
      for (let i = 0; i < count; i++) {
        const ctl = controls.nth(i);
        let label = '';
        let visible = false;
        let enabled = false;
        try {
          label = ((await ctl.getAttribute('aria-label')) || (await ctl.innerText().catch(() => '')) || (await ctl.getAttribute('value')) || '').trim().replace(/\s+/g, ' ').slice(0, 140);
          visible = await ctl.isVisible();
          enabled = await ctl.isEnabled();
        } catch {}
        const b = { index: i, label, visible, enabled, click: 'not-run', urlAfter: null };
        if (visible && !label) rec.unlabeledButtons.push({ index: i });
        if (!visible || !enabled) { rec.buttons.push(b); continue; }
        try {
          const before = page.url();
          await ctl.click({ timeout: 4000 });
          await page.waitForTimeout(250);
          b.click = 'ok';
          b.urlAfter = page.url();
          if (page.url() !== before && sameOrigin(before)) {
            await page.goto(before, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT }).catch(() => {});
            await page.waitForTimeout(150);
          }
        } catch (e) {
          b.click = 'error';
          b.error = String(e).slice(0, 500);
        }
        rec.buttons.push(b);
      }
    } catch (e) {
      rec.nav.error = String(e);
    }

    pages.push(rec);
    await page.close();
  }

  await browser.close();
  return pages;
}

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p));
  return sorted[idx];
}

async function loadStage(concurrency, total, routes) {
  const latencies = [];
  const statuses = {};
  let cursor = 0;
  let failures = 0;
  const startedAt = performance.now();

  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= total) return;
      const route = routes[i % routes.length];
      const url = new URL(route, ORIGIN).toString();
      const t0 = performance.now();
      try {
        const r = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          headers: { 'user-agent': 'LMTYAI-QA-Load/1.0', 'cache-control': 'no-cache' },
          signal: AbortSignal.timeout(NAV_TIMEOUT),
        });
        latencies.push(Math.round(performance.now() - t0));
        statuses[r.status] = (statuses[r.status] || 0) + 1;
        if (!r.ok) failures++;
        await r.arrayBuffer();
      } catch {
        latencies.push(Math.round(performance.now() - t0));
        failures++;
        statuses.error = (statuses.error || 0) + 1;
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const durationMs = Math.round(performance.now() - startedAt);
  return {
    concurrency,
    total,
    failures,
    errorRate: total ? failures / total : 0,
    durationMs,
    requestsPerSecond: Number((total / (durationMs / 1000)).toFixed(2)),
    p50Ms: percentile(latencies, 0.50),
    p95Ms: percentile(latencies, 0.95),
    p99Ms: percentile(latencies, 0.99),
    maxMs: latencies.length ? Math.max(...latencies) : null,
    statuses,
  };
}

const sitemapUrls = await discoverSitemap();
result.discovery.sitemapUrls = sitemapUrls;

const desktopPages = await crawlAndTest('desktop', { width: 1440, height: 1000 }, sitemapUrls);
const mobilePages = await crawlAndTest('mobile', { width: 390, height: 844 }, sitemapUrls);
result.viewports.desktop = desktopPages;
result.viewports.mobile = mobilePages;
result.discovery.crawledUrls = uniq([...desktopPages, ...mobilePages].map((p) => p.url));

const loadRoutes = ['/', '/start-here', '/learn', '/guides', '/pricing', '/ai-work-kit'];
result.load.stages = [];
for (const c of [5, 10, 20]) {
  result.load.stages.push(await loadStage(c, c * 12, loadRoutes));
  await new Promise((r) => setTimeout(r, 1200));
}

const allPages = [...desktopPages, ...mobilePages];
const allButtons = allPages.flatMap((p) => p.buttons || []);
const failedButtons = allButtons.filter((b) => b.click === 'error');
const brokenLinks = allPages.flatMap((p) => p.brokenLinks || []);
const consoleErrors = allPages.flatMap((p) => p.consoleErrors || []);
const pageErrors = allPages.flatMap((p) => p.pageErrors || []);
const badResponses = allPages.flatMap((p) => p.badResponses || []);
const unlabeledButtons = allPages.flatMap((p) => p.unlabeledButtons || []);
const blockedWrites = allPages.flatMap((p) => p.blockedWrites || []);
const loadFailures = result.load.stages.reduce((n, s) => n + s.failures, 0);

result.summary = {
  uniquePagesTested: result.discovery.crawledUrls.length,
  pageViewportRuns: allPages.length,
  buttonsSeen: allButtons.length,
  buttonsClickedSafely: allButtons.filter((b) => b.click === 'ok').length,
  buttonClickErrors: failedButtons.length,
  unlabeledButtons: unlabeledButtons.length,
  brokenSameSiteLinks: brokenLinks.length,
  consoleErrors: consoleErrors.length,
  pageErrors: pageErrors.length,
  badNetworkResponses: badResponses.length,
  blockedMutationAttempts: blockedWrites.length,
  loadRequests: result.load.stages.reduce((n, s) => n + s.total, 0),
  loadFailures,
};
result.finishedAt = new Date().toISOString();

await fs.writeFile('qa-report.json', JSON.stringify(result, null, 2));
console.log('QA_SUMMARY', JSON.stringify(result.summary));
for (const stage of result.load.stages) console.log('LOAD_STAGE', JSON.stringify(stage));
if (failedButtons.length) console.log('BUTTON_ERRORS', JSON.stringify(failedButtons.slice(0, 30)));
if (brokenLinks.length) console.log('BROKEN_LINKS', JSON.stringify(brokenLinks.slice(0, 30)));
if (consoleErrors.length) console.log('CONSOLE_ERRORS', JSON.stringify(consoleErrors.slice(0, 30)));
if (pageErrors.length) console.log('PAGE_ERRORS', JSON.stringify(pageErrors.slice(0, 30)));
