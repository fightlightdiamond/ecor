"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_module_1 = require("node:module");
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
const backendRequire = (0, node_module_1.createRequire)(node_path_1.default.join(process.cwd(), "package.json"));
const dashboardReactRouterDom = node_path_1.default.dirname(backendRequire.resolve("react-router-dom/package.json", {
    paths: [backendRequire.resolve("@medusajs/dashboard")],
}));
module.exports = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        http: {
            storeCors: process.env.STORE_CORS,
            adminCors: process.env.ADMIN_CORS,
            authCors: process.env.AUTH_CORS,
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBNEI7QUFDNUIsNkNBQTJDO0FBQzNDLHFEQUFpRTtBQUVqRSxJQUFBLGVBQU8sRUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxhQUFhLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7QUFFN0QsTUFBTSxjQUFjLEdBQUcsSUFBQSwyQkFBYSxFQUFDLG1CQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFBO0FBQzlFLE1BQU0sdUJBQXVCLEdBQUcsbUJBQUksQ0FBQyxPQUFPLENBQzFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUU7SUFDdEQsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0NBQ3ZELENBQUMsQ0FDSCxDQUFBO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFBLG9CQUFZLEVBQUM7SUFDNUIsYUFBYSxFQUFFO1FBQ2IsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtRQUNyQyxJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXO1lBQ2xDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVc7WUFDbEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBVTtZQUNoQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVO1lBQ2pDLFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWE7U0FDeEM7S0FDRjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsa0JBQWtCLENBQUM7Z0JBQ2xELEtBQUssRUFBRTtvQkFDTCxrQkFBa0IsRUFBRSx1QkFBdUI7aUJBQzVDO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7SUFDRCxPQUFPLEVBQUU7UUFDUDtZQUNFLE9BQU8sRUFBRSx3QkFBd0I7U0FDbEM7UUFDRDtZQUNFLE9BQU8sRUFBRSxnQkFBZ0I7WUFDekIsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsc0JBQXNCO3dCQUMvQixFQUFFLEVBQUUsT0FBTzt3QkFDWCxPQUFPLEVBQUU7NEJBQ1AsVUFBVSxFQUFFLFFBQVE7NEJBQ3BCLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLHVCQUF1Qjt5QkFDdkU7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUEifQ==