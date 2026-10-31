import assert from "node:assert/strict";
import { subscribeToBrevo } from "../lib/brevo-newsletter.ts";

{
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, status: 201 };
  };
  const result = await subscribeToBrevo({
    apiKey: "secret",
    listId: "42",
    email: "person@example.com",
    firstName: "Pat",
    fetchImpl,
  });
  assert.deepEqual(result, { ok: true, alreadySubscribed: false });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.brevo.com/v3/contacts");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.headers["api-key"], "secret");
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    email: "person@example.com",
    listIds: [42],
    updateEnabled: true,
    attributes: { FIRSTNAME: "Pat" },
  });
}

{
  const result = await subscribeToBrevo({
    apiKey: "secret",
    listId: "42",
    email: "existing@example.com",
    fetchImpl: async () => ({ ok: true, status: 204 }),
  });
  assert.deepEqual(result, { ok: true, alreadySubscribed: true });
}

{
  const result = await subscribeToBrevo({
    apiKey: "secret",
    listId: "42",
    email: "fail@example.com",
    fetchImpl: async () => ({ ok: false, status: 500 }),
  });
  assert.deepEqual(result, { ok: false, reason: "upstream_error" });
}

{
  let called = false;
  const result = await subscribeToBrevo({
    apiKey: "secret",
    listId: "not-a-list",
    email: "bad@example.com",
    fetchImpl: async () => {
      called = true;
      return { ok: true, status: 201 };
    },
  });
  assert.deepEqual(result, { ok: false, reason: "upstream_error" });
  assert.equal(called, false);
}

console.log("brevo newsletter contract ok");
