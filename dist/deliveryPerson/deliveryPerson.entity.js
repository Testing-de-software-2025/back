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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryPersonEntity = exports.DeliveryPersonStatus = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const zone_entity_1 = require("../zone/zone.entity");
var DeliveryPersonStatus;
(function (DeliveryPersonStatus) {
    DeliveryPersonStatus["AVAILABLE"] = "available";
    DeliveryPersonStatus["IN_ROUTE"] = "in_route";
    DeliveryPersonStatus["DELIVERING"] = "delivering";
    DeliveryPersonStatus["WAITING_FOR_ORDER"] = "waiting_for_order";
    DeliveryPersonStatus["UNAVAILABLE"] = "unavailable";
    DeliveryPersonStatus["WITH_ISSUE"] = "with_issue";
    DeliveryPersonStatus["OFFLINE"] = "offline";
})(DeliveryPersonStatus || (exports.DeliveryPersonStatus = DeliveryPersonStatus = {}));
let DeliveryPersonEntity = class DeliveryPersonEntity extends typeorm_1.BaseEntity {
    id;
    personId;
    location;
    radius;
    status;
    zones;
};
exports.DeliveryPersonEntity = DeliveryPersonEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeliveryPersonEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", name: "personid" }),
    __metadata("design:type", Number)
], DeliveryPersonEntity.prototype, "personId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], DeliveryPersonEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 3 }),
    __metadata("design:type", Number)
], DeliveryPersonEntity.prototype, "radius", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: DeliveryPersonStatus,
        default: DeliveryPersonStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], DeliveryPersonEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_2.ManyToMany)(() => zone_entity_1.Zone, (zone) => zone.deliveryPerson, { eager: true }),
    (0, typeorm_2.JoinTable)(),
    __metadata("design:type", Array)
], DeliveryPersonEntity.prototype, "zones", void 0);
exports.DeliveryPersonEntity = DeliveryPersonEntity = __decorate([
    (0, typeorm_1.Entity)("delivery")
], DeliveryPersonEntity);
//# sourceMappingURL=deliveryPerson.entity.js.map