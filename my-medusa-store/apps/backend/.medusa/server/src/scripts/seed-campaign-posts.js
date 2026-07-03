"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedCampaignPosts;
const campaign_1 = require("../modules/campaign");
async function seedCampaignPosts({ container }) {
    const campaignModuleService = container.resolve(campaign_1.CAMPAIGN_MODULE);
    const existing = await campaignModuleService.listCampaignPosts({
        slug: "welcome-to-our-store",
    });
    if (existing.length) {
        console.log("Sample campaign post already exists, skipping.");
        return;
    }
    await campaignModuleService.createCampaignPosts({
        title: "Welcome to Our Store",
        slug: "welcome-to-our-store",
        is_active: true,
        publish_at: new Date(),
        unpublish_at: null,
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "Welcome to Our Store" }],
                },
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "This is a sample campaign post created by the seed script. You can edit or delete it from the Medusa Admin under Campaign Posts.",
                        },
                    ],
                },
                {
                    type: "bulletList",
                    content: [
                        {
                            type: "listItem",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [
                                        {
                                            type: "text",
                                            text: "Create posts in Admin → Campaign Posts",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "listItem",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [
                                        {
                                            type: "text",
                                            text: "Schedule publish and unpublish times",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "listItem",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [
                                        {
                                            type: "text",
                                            text: "Content appears on the storefront automatically",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    });
    console.log("Sample campaign post created: welcome-to-our-store");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1jYW1wYWlnbi1wb3N0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQtY2FtcGFpZ24tcG9zdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxvQ0F3RkM7QUEzRkQsa0RBQXFEO0FBR3RDLEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNyRSxNQUFNLHFCQUFxQixHQUN6QixTQUFTLENBQUMsT0FBTyxDQUFDLDBCQUFlLENBQUMsQ0FBQTtJQUVwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLHFCQUFxQixDQUFDLGlCQUFpQixDQUFDO1FBQzdELElBQUksRUFBRSxzQkFBc0I7S0FDN0IsQ0FBQyxDQUFBO0lBRUYsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnREFBZ0QsQ0FBQyxDQUFBO1FBQzdELE9BQU07SUFDUixDQUFDO0lBRUQsTUFBTSxxQkFBcUIsQ0FBQyxtQkFBbUIsQ0FBQztRQUM5QyxLQUFLLEVBQUUsc0JBQXNCO1FBQzdCLElBQUksRUFBRSxzQkFBc0I7UUFDNUIsU0FBUyxFQUFFLElBQUk7UUFDZixVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUU7UUFDdEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtvQkFDbkIsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxzQkFBc0IsRUFBRSxDQUFDO2lCQUMxRDtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsV0FBVztvQkFDakIsT0FBTyxFQUFFO3dCQUNQOzRCQUNFLElBQUksRUFBRSxNQUFNOzRCQUNaLElBQUksRUFBRSxrSUFBa0k7eUJBQ3pJO3FCQUNGO2lCQUNGO2dCQUNEO29CQUNFLElBQUksRUFBRSxZQUFZO29CQUNsQixPQUFPLEVBQUU7d0JBQ1A7NEJBQ0UsSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLE9BQU8sRUFBRTtnQ0FDUDtvQ0FDRSxJQUFJLEVBQUUsV0FBVztvQ0FDakIsT0FBTyxFQUFFO3dDQUNQOzRDQUNFLElBQUksRUFBRSxNQUFNOzRDQUNaLElBQUksRUFBRSx3Q0FBd0M7eUNBQy9DO3FDQUNGO2lDQUNGOzZCQUNGO3lCQUNGO3dCQUNEOzRCQUNFLElBQUksRUFBRSxVQUFVOzRCQUNoQixPQUFPLEVBQUU7Z0NBQ1A7b0NBQ0UsSUFBSSxFQUFFLFdBQVc7b0NBQ2pCLE9BQU8sRUFBRTt3Q0FDUDs0Q0FDRSxJQUFJLEVBQUUsTUFBTTs0Q0FDWixJQUFJLEVBQUUsc0NBQXNDO3lDQUM3QztxQ0FDRjtpQ0FDRjs2QkFDRjt5QkFDRjt3QkFDRDs0QkFDRSxJQUFJLEVBQUUsVUFBVTs0QkFDaEIsT0FBTyxFQUFFO2dDQUNQO29DQUNFLElBQUksRUFBRSxXQUFXO29DQUNqQixPQUFPLEVBQUU7d0NBQ1A7NENBQ0UsSUFBSSxFQUFFLE1BQU07NENBQ1osSUFBSSxFQUFFLGlEQUFpRDt5Q0FDeEQ7cUNBQ0Y7aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvREFBb0QsQ0FBQyxDQUFBO0FBQ25FLENBQUMifQ==