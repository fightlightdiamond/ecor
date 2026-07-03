"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const campaign_1 = require("../../../modules/campaign");
/**
 * GET /store/campaign-posts
 *
 * Returns campaign posts that pass the auto-publish visibility filter:
 * is_active=true AND publish_at<=now AND (unpublish_at IS NULL OR unpublish_at>=now)
 */
async function GET(req, res) {
    const campaignModuleService = req.scope.resolve(campaign_1.CAMPAIGN_MODULE);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;
    const [posts, count] = await campaignModuleService.listAndCountActiveCampaignPosts({}, {
        take: limit,
        skip: offset,
        order: { publish_at: "DESC" },
    });
    res.json({
        campaign_posts: posts,
        count,
        limit,
        offset,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2NhbXBhaWduLXBvc3RzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBVUEsa0JBdUJDO0FBaENELHdEQUEyRDtBQUczRDs7Ozs7R0FLRztBQUNJLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxNQUFNLHFCQUFxQixHQUN6QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQkFBZSxDQUFDLENBQUE7SUFFcEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDMUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRTVDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQ2xCLE1BQU0scUJBQXFCLENBQUMsK0JBQStCLENBQ3pELEVBQUUsRUFDRjtRQUNFLElBQUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO0tBQzlCLENBQ0YsQ0FBQTtJQUVILEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDUCxjQUFjLEVBQUUsS0FBSztRQUNyQixLQUFLO1FBQ0wsS0FBSztRQUNMLE1BQU07S0FDUCxDQUFDLENBQUE7QUFDSixDQUFDIn0=