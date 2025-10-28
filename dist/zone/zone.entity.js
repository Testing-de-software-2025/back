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
exports.Zone = void 0;
const typeorm_1 = require("typeorm");
const deliveryPerson_entity_1 = require("../deliveryPerson/deliveryPerson.entity");
let Zone = class Zone extends typeorm_1.BaseEntity {
    id;
    name;
    location;
    radius;
    deliveryPerson;
};
exports.Zone = Zone;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Zone.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Zone.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], Zone.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 3 }),
    __metadata("design:type", Number)
], Zone.prototype, "radius", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => deliveryPerson_entity_1.DeliveryPersonEntity, (deliveryPerson) => deliveryPerson.zones, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Zone.prototype, "deliveryPerson", void 0);
exports.Zone = Zone = __decorate([
    (0, typeorm_1.Entity)("zone")
], Zone);
//# sourceMappingURL=zone.entity.js.map