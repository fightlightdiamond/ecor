"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
const campaign_1 = require("../../../../modules/campaign");
/**
 * GET /store/campaign-posts/:slug
 *
 * Returns a single active campaign post by slug.
 */
async function GET(req, res) {
    const { slug } = req.params;
    const campaignModuleService = req.scope.resolve(campaign_1.CAMPAIGN_MODULE);
    const posts = await campaignModuleService.listActiveCampaignPosts({ slug }, { take: 1 });
    if (!posts.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Campaign post with slug "${slug}" was not found`);
    }
    res.json({ campaign_post: posts[0] });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2NhbXBhaWduLXBvc3RzL1tzbHVnXS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVVBLGtCQW1CQztBQTVCRCxxREFBdUQ7QUFDdkQsMkRBQThEO0FBRzlEOzs7O0dBSUc7QUFDSSxLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7SUFFM0IsTUFBTSxxQkFBcUIsR0FDekIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsMEJBQWUsQ0FBQyxDQUFBO0lBRXBDLE1BQU0sS0FBSyxHQUFHLE1BQU0scUJBQXFCLENBQUMsdUJBQXVCLENBQy9ELEVBQUUsSUFBSSxFQUFFLEVBQ1IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQ1osQ0FBQTtJQUVELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEIsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDM0IsNEJBQTRCLElBQUksaUJBQWlCLENBQ2xELENBQUE7SUFDSCxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZDLENBQUMifQ==