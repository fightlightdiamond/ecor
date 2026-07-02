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
    // Each of the ~25 core modules opens its own Postgres pool at boot. The
    // default pool.min (2) makes every module eagerly open connections
    // simultaneously — a 50+ connection burst that Postgres over the WSL2
    // docker bridge sometimes can't establish fast enough, surfacing as
    // "Knex: Timeout acquiring a connection" during db:migrate. Lazy pools
    // (min: 0) plus a longer acquire timeout avoid the burst.
    databaseDriverOptions: {
      pool: { min: 0, max: 10, acquireTimeoutMillis: 60000 },
    },
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
      server: {
        hmr: {
          // Without this, the HMR websocket the browser injects picks an
          // internal port Vite chose for itself inside the container, which
          // isn't published through infra/docker-compose.yml's nginx —
          // the browser then fails to connect to that random port. Forcing
          // it onto the port nginx actually publishes makes it work whether
          // the admin is loaded through nginx or directly at :9000.
          clientPort: Number(process.env.HTTP_PORT) || 9000,
          protocol: "ws",
        },
      },
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
  ],
})
