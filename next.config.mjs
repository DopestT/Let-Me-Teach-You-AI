import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root to this project so Next doesn't pick up unrelated
  // lockfiles higher up the filesystem.
  turbopack: {
    root: projectRoot,
  },
  // Note: the permanent .net -> .com redirect is enforced in proxy.ts
  // (host-based) so it works regardless of which domain maps to this app.
};

export default nextConfig;
