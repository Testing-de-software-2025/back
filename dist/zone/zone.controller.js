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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneController = void 0;
const common_1 = require("@nestjs/common");
const zone_service_1 = require("./zone.service");
const CreateZone_dto_1 = require("./dto/CreateZone.dto");
const UpdateZone_dto_1 = require("./dto/UpdateZone.dto");
const UpdatePartialZone_dto_1 = require("./dto/UpdatePartialZone.dto");
const pagination_dto_1 = require("../common/pagination/pagination.dto");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const permissions_decorator_1 = require("../middlewares/decorators/permissions.decorator");
let ZoneController = class ZoneController {
    zoneService;
    constructor(zoneService) {
        this.zoneService = zoneService;
    }
    findAll(pagination) {
        return this.zoneService.findAll(pagination);
    }
    create(createZone) {
        return this.zoneService.create(createZone);
    }
    async findOne(id) {
        try {
            const zone = await this.zoneService.findOne(+id);
            if (!zone) {
                throw new common_1.HttpException("Zone not found", common_1.HttpStatus.NOT_FOUND);
            }
            return zone;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateZoneDto) {
        try {
            const zone = await this.zoneService.update(+id, updateZoneDto);
            if (!zone) {
                throw new common_1.HttpException("Zone not found", common_1.HttpStatus.NOT_FOUND);
            }
            return zone;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePartial(id, updateZoneDto) {
        try {
            const zone = await this.zoneService.updatePartial(+id, updateZoneDto);
            if (!zone) {
                throw new common_1.HttpException("Zone not found", common_1.HttpStatus.NOT_FOUND);
            }
            return zone;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            await this.zoneService.remove(+id);
            return { message: "Zone deleted successfully" };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ZoneController = ZoneController;
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(["zone_read"]),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], ZoneController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(["zone_create"]),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateZone_dto_1.CreateZone]),
    __metadata("design:returntype", void 0)
], ZoneController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(["zone_read"]),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZoneController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(["zone_edit"]),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateZone_dto_1.UpdateZone]),
    __metadata("design:returntype", Promise)
], ZoneController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(["zone_edit"]),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePartialZone_dto_1.UpdatePartialZone]),
    __metadata("design:returntype", Promise)
], ZoneController.prototype, "updatePartial", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(["zone_delete"]),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZoneController.prototype, "remove", null);
exports.ZoneController = ZoneController = __decorate([
    (0, common_1.Controller)("zones"),
    __metadata("design:paramtypes", [zone_service_1.ZoneService])
], ZoneController);
//# sourceMappingURL=zone.controller.js.map