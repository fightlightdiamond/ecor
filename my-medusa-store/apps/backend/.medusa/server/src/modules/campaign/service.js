"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const campaign_post_1 = __importDefault(require("./models/campaign-post"));
class CampaignModuleService extends (0, utils_1.MedusaService)({
    CampaignPost: campaign_post_1.default,
}) {
    /**
     * Returns posts that are currently visible on the storefront:
     * is_active = true
     * AND (publish_at IS NULL OR publish_at <= now)
     * AND (unpublish_at IS NULL OR unpublish_at >= now)
     */
    async listActiveCampaignPosts(filters = {}, config = {}, sharedContext = {}) {
        const now = new Date();
        const activeFilters = {
            ...filters,
            is_active: true,
            $and: [
                {
                    $or: [{ publish_at: null }, { publish_at: { $lte: now } }],
                },
                {
                    $or: [{ unpublish_at: null }, { unpublish_at: { $gte: now } }],
                },
            ],
        };
        return await this.listCampaignPosts(activeFilters, config, sharedContext);
    }
    async listAndCountActiveCampaignPosts(filters = {}, config = {}, sharedContext = {}) {
        const now = new Date();
        const activeFilters = {
            ...filters,
            is_active: true,
            $and: [
                {
                    $or: [{ publish_at: null }, { publish_at: { $lte: now } }],
                },
                {
                    $or: [{ unpublish_at: null }, { unpublish_at: { $gte: now } }],
                },
            ],
        };
        return await this.listAndCountCampaignPosts(activeFilters, config, sharedContext);
    }
}
__decorate([
    (0, utils_1.InjectManager)(),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CampaignModuleService.prototype, "listActiveCampaignPosts", null);
__decorate([
    (0, utils_1.InjectManager)(),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CampaignModuleService.prototype, "listAndCountActiveCampaignPosts", null);
exports.default = CampaignModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NhbXBhaWduL3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxREFJa0M7QUFFbEMsMkVBQWlEO0FBUWpELE1BQU0scUJBQXNCLFNBQVEsSUFBQSxxQkFBYSxFQUFDO0lBQ2hELFlBQVksRUFBWix1QkFBWTtDQUNiLENBQUM7SUFDQTs7Ozs7T0FLRztJQUVHLEFBQU4sS0FBSyxDQUFDLHVCQUF1QixDQUMzQixVQUErQixFQUFFLEVBQ2pDLFNBQWtDLEVBQUUsRUFDbkIsZ0JBQXlCLEVBQUU7UUFFNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtRQUV0QixNQUFNLGFBQWEsR0FBRztZQUNwQixHQUFHLE9BQU87WUFDVixTQUFTLEVBQUUsSUFBSTtZQUNmLElBQUksRUFBRTtnQkFDSjtvQkFDRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO2lCQUMzRDtnQkFDRDtvQkFDRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO2lCQUMvRDthQUNGO1NBQ0YsQ0FBQTtRQUVELE9BQU8sTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0lBR0ssQUFBTixLQUFLLENBQUMsK0JBQStCLENBQ25DLFVBQStCLEVBQUUsRUFDakMsU0FBa0MsRUFBRSxFQUNuQixnQkFBeUIsRUFBRTtRQUU1QyxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO1FBRXRCLE1BQU0sYUFBYSxHQUFHO1lBQ3BCLEdBQUcsT0FBTztZQUNWLFNBQVMsRUFBRSxJQUFJO1lBQ2YsSUFBSSxFQUFFO2dCQUNKO29CQUNFLEdBQUcsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7aUJBQzNEO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7aUJBQy9EO2FBQ0Y7U0FDRixDQUFBO1FBRUQsT0FBTyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FDekMsYUFBYSxFQUNiLE1BQU0sRUFDTixhQUFhLENBQ2QsQ0FBQTtJQUNILENBQUM7Q0FDRjtBQWxETztJQURMLElBQUEscUJBQWEsR0FBRTtJQUliLFdBQUEsSUFBQSxxQkFBYSxHQUFFLENBQUE7Ozs7b0VBa0JqQjtBQUdLO0lBREwsSUFBQSxxQkFBYSxHQUFFO0lBSWIsV0FBQSxJQUFBLHFCQUFhLEdBQUUsQ0FBQTs7Ozs0RUFzQmpCO0FBR0gsa0JBQWUscUJBQXFCLENBQUEifQ==