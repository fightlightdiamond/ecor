"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCampaignPostsSchema = void 0;
const http_1 = require("@medusajs/framework/http");
const validators_1 = require("@medusajs/medusa/api/utils/validators");
exports.GetCampaignPostsSchema = (0, validators_1.createFindParams)();
exports.default = (0, http_1.defineMiddlewares)({
    routes: [
        {
            matcher: "/admin/campaign-posts",
            method: "GET",
            middlewares: [
                (0, http_1.validateAndTransformQuery)(exports.GetCampaignPostsSchema, {
                    defaults: [
                        "id",
                        "title",
                        "slug",
                        "is_active",
                        "publish_at",
                        "unpublish_at",
                        "created_at",
                    ],
                    isList: true,
                }),
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUdpQztBQUNqQyxzRUFBd0U7QUFFM0QsUUFBQSxzQkFBc0IsR0FBRyxJQUFBLDZCQUFnQixHQUFFLENBQUE7QUFFeEQsa0JBQWUsSUFBQSx3QkFBaUIsRUFBQztJQUMvQixNQUFNLEVBQUU7UUFDTjtZQUNFLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsTUFBTSxFQUFFLEtBQUs7WUFDYixXQUFXLEVBQUU7Z0JBQ1gsSUFBQSxnQ0FBeUIsRUFBQyw4QkFBc0IsRUFBRTtvQkFDaEQsUUFBUSxFQUFFO3dCQUNSLElBQUk7d0JBQ0osT0FBTzt3QkFDUCxNQUFNO3dCQUNOLFdBQVc7d0JBQ1gsWUFBWTt3QkFDWixjQUFjO3dCQUNkLFlBQVk7cUJBQ2I7b0JBQ0QsTUFBTSxFQUFFLElBQUk7aUJBQ2IsQ0FBQzthQUNIO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQSJ9