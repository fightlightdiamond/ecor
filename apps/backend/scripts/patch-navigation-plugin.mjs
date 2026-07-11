/**
 * medusa-navigation-menu ships its own Medusa SDK with auth.type = "session".
 * Our admin uses JWT on http://localhost (ADMIN_AUTH_TYPE=jwt), so plugin API
 * calls never send Authorization and return 401.
 *
 * Patch the plugin to reuse the dashboard SDK (window.__sdk) or match __AUTH_TYPE__.
 */
import { createRequire } from "node:module"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"

const require = createRequire(import.meta.url)

let pkgRoot
try {
  pkgRoot = dirname(require.resolve("medusa-navigation-menu/package.json"))
} catch {
  console.warn("[patch-navigation-plugin] medusa-navigation-menu not installed, skipping")
  process.exit(0)
}

const OLD_SDK_ESM = `const sdk = new Medusa({
  baseUrl: "/",
  debug: false,
  auth: {
    type: "session"
  }
});`

const OLD_SDK_CJS = `const sdk = new Medusa__default.default({
  baseUrl: "/",
  debug: false,
  auth: {
    type: "session"
  }
});`

const NEW_SDK = `function resolveNavigationSdk() {
  if (typeof window !== "undefined" && window.__sdk) {
    return window.__sdk;
  }
  resolveNavigationSdk._sdk ??= new Medusa({
    baseUrl: typeof __BACKEND_URL__ !== "undefined" ? __BACKEND_URL__ : "/",
    debug: false,
    auth: {
      type: typeof __AUTH_TYPE__ !== "undefined" ? __AUTH_TYPE__ : "jwt",
      jwtTokenStorageKey:
        typeof __JWT_TOKEN_STORAGE_KEY__ !== "undefined"
          ? __JWT_TOKEN_STORAGE_KEY__
          : void 0,
    },
  });
  return resolveNavigationSdk._sdk;
}
const sdk = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = resolveNavigationSdk();
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);`

const adminDir = join(pkgRoot, ".medusa/server/src/admin")
let patched = 0

for (const file of ["index.mjs", "index.js"]) {
  const path = join(adminDir, file)
  if (!existsSync(path)) {
    continue
  }

  const source = readFileSync(path, "utf8")
  if (source.includes("resolveNavigationSdk")) {
    patched++
    continue
  }

  let next = source
  if (source.includes(OLD_SDK_ESM)) {
    next = next.replace(OLD_SDK_ESM, NEW_SDK)
  } else if (source.includes(OLD_SDK_CJS)) {
    next = next.replace(OLD_SDK_CJS, NEW_SDK)
  } else {
    console.warn(`[patch-navigation-plugin] Unexpected SDK block in ${file}, skipping`)
    continue
  }

  writeFileSync(path, next, "utf8")
  patched++
  console.log(`[patch-navigation-plugin] Patched ${file}`)
}

if (patched === 0) {
  console.warn("[patch-navigation-plugin] No files patched")
}
