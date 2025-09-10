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
exports.DeliveryPersonController = void 0;
const common_1 = require("@nestjs/common");
const deliveryPerson_service_1 = require("./deliveryPerson.service");
const pagination_dto_1 = require("../common/pagination/pagination.dto");
const CreateDeliveryPerson_dto_1 = require("./dto/CreateDeliveryPerson.dto");
const UpdateLocationDeliveryPerson_dto_1 = require("./dto/UpdateLocationDeliveryPerson.dto");
const UpdateStatusDeliveryPerson_dto_1 = require("./dto/UpdateStatusDeliveryPerson.dto");
const FindByProximityDeliveryPerson_dto_1 = require("./dto/FindByProximityDeliveryPerson.dto");
const FindByZone_dto_1 = require("./dto/FindByZone.dto");
const AssignZoneDeliveryPerson_dto_1 = require("./dto/AssignZoneDeliveryPerson.dto");
const permissions_decorator_1 = require("../middlewares/decorators/permissions.decorator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
let DeliveryPersonController = class DeliveryPersonController {
    deliveryPersonService;
    constructor(deliveryPersonService) {
        this.deliveryPersonService = deliveryPersonService;
    }
    async create(CreateDeliveryPerson) {
        try {
            return await this.deliveryPersonService.create(CreateDeliveryPerson);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findall(paginationDto) {
        try {
            return await this.deliveryPersonService.findAll(paginationDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            return await this.deliveryPersonService.findById(id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async updateLocation(id, updateLocationDto) {
        try {
            const deliveryPerson = await this.deliveryPersonService.updateLocation(+id, updateLocationDto);
            if (!deliveryPerson) {
                throw new common_1.HttpException("Delivery person not found", common_1.HttpStatus.NOT_FOUND);
            }
            return deliveryPerson;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateStatus(id, updateStatusDto) {
        try {
            const deliveryPerson = await this.deliveryPersonService.updateStatus(+id, updateStatusDto);
            if (!deliveryPerson) {
                throw new common_1.HttpException("Delivery person not found", common_1.HttpStatus.NOT_FOUND);
            }
            return deliveryPerson;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByProximity(findByProximityDto) {
        try {
            return await this.deliveryPersonService.findByProximity(findByProximityDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByZone(FindByZone) {
        try {
            return await this.deliveryPersonService.findByZone(FindByZone);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async assignZone(id, assignZoneDto) {
        try {
            const deliveryPerson = await this.deliveryPersonService.assignZone(+id, assignZoneDto);
            if (!deliveryPerson) {
                throw new common_1.HttpException("Delivery person not found", common_1.HttpStatus.NOT_FOUND);
            }
            return deliveryPerson;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getZonesAssigned(id) {
        try {
            const zones = await this.deliveryPersonService.getZonesAssigned(id);
            if (!zones.length) {
                throw new common_1.HttpException("No zones found for this delivery person", common_1.HttpStatus.NOT_FOUND);
            }
            return zones;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeZone(id, zoneId) {
        try {
            await this.deliveryPersonService.unassignZone(+id, +zoneId);
            return { message: "Zone removed from delivery" };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            await this.deliveryPersonService.remove(+id);
            return { message: 'Delivery deleted' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DeliveryPersonController = DeliveryPersonController;
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_create']),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateDeliveryPerson_dto_1.CreateDeliveryPerson]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_read']),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "findall", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_read']),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_edit']),
    (0, common_1.Put)(":id/location"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLocationDeliveryPerson_dto_1.UpdateLocationDeliveryPerson]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_edit']),
    (0, common_1.Put)(":id/status"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStatusDeliveryPerson_dto_1.UpdateStatusDeliveryPerson]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_read', 'delivery_zone_assignment']),
    (0, common_1.Post)('findByProximity'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FindByProximityDeliveryPerson_dto_1.FindByProximityDeliveryPerson]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "findByProximity", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_read', 'delivery_zone_assignment']),
    (0, common_1.Post)('findByZone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FindByZone_dto_1.FindByZone]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "findByZone", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_zone_assignment']),
    (0, common_1.Post)(':id/assignZone'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AssignZoneDeliveryPerson_dto_1.AssignZoneDeliveryPerson]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "assignZone", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_read']),
    (0, common_1.Get)(':id/zones'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "getZonesAssigned", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_zone_assignment']),
    (0, common_1.Delete)(":id/zone/:zoneId"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('zoneId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "removeZone", null);
__decorate([
    (0, common_1.UseGuards)(auth_middleware_1.AuthGuard),
    (0, permissions_decorator_1.Permissions)(['delivery_delete']),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryPersonController.prototype, "remove", null);
exports.DeliveryPersonController = DeliveryPersonController = __decorate([
    (0, common_1.Controller)('delivery'),
    __metadata("design:paramtypes", [deliveryPerson_service_1.DeliveryPersonService])
], DeliveryPersonController);
//# sourceMappingURL=deliveryPerson.controller.js.map