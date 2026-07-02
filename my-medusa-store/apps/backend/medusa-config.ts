import path from "node:path"
import { createRequire } from "node:module"
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const backendRequire = createRequire(path.join(process.cwd(), "package.json"))
const dashboardReactRouterDom = path.dirname(
  backendRequire.resolve("react-router-dom/package.json", {
    paths: [backendRequire.resolve("@medusajs/dashboard")],
  })
)

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  admin: {
    vite: () => ({
      resolve: {
        dedupe: ["react", "react-dom", "react-router-dom"],
        alias: {
          "react-router-dom": dashboardReactRouterDom,
        },
      },
    }),
  },
  modules: [
    {
      resolve: "./src/modules/campaign",
    },
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
            },
          },
        ],
      },
    },
  ],
})

