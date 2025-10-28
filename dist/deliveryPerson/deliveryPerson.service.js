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
exports.DeliveryPersonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deliveryPerson_entity_1 = require("./deliveryPerson.entity");
const zone_entity_1 = require("../zone/zone.entity");
const zone_service_1 = require("../zone/zone.service");
let DeliveryPersonService = class DeliveryPersonService {
    deliveryPersonRepository;
    zoneService;
    async unassignAllZones(deliveryPersonId) {
        const deliveryPerson = await this.deliveryPersonRepository.findOneOrFail({
            where: { id: deliveryPersonId },
            relations: ["zones"],
        });
        deliveryPerson.zones = [];
        return await this.deliveryPersonRepository.save(deliveryPerson);
    }
    constructor(deliveryPersonRepository, zoneService) {
        this.deliveryPersonRepository = deliveryPersonRepository;
        this.zoneService = zoneService;
    }
    async create(CreateDeliveryPerson) {
        const deliveryPerson = this.deliveryPersonRepository.create(CreateDeliveryPerson);
        return await this.deliveryPersonRepository.save(deliveryPerson);
    }
    async findAll(paginationDto) {
        const { limit, offset } = paginationDto;
        const [deliveries, total] = await this.deliveryPersonRepository.findAndCount({
            take: limit,
            skip: offset,
            relations: ["zones"],
        });
        return { deliveries, total };
    }
    async findById(id) {
        return await this.deliveryPersonRepository.findOneOrFail({
            where: { id },
            relations: ["zones"],
        });
    }
    async updateLocation(id, updateLocation) {
        const deliveryPerson = await this.deliveryPersonRepository.findOne({
            where: { id },
        });
        if (!deliveryPerson) {
            throw new common_1.NotFoundException(`Delivery person with ID ${id} not found`);
        }
        Object.assign(deliveryPerson, updateLocation);
        return this.deliveryPersonRepository.save(deliveryPerson);
    }
    async updateStatus(id, dto) {
        const entity = await this.deliveryPersonRepository.findOneOrFail({
            where: { id },
        });
        Object.assign(entity, dto);
        return this.deliveryPersonRepository.save(entity);
    }
    async findByProximity(findByProximityDto) {
        const { location, radius } = findByProximityDto;
        const allDeliveryPersons = await this.deliveryPersonRepository.find();
        const filteredDeliveryPersons = allDeliveryPersons.filter((deliveryPerson) => {
            const distance = this.calculateDistance(location.lat, location.lng, deliveryPerson.location.lat, deliveryPerson.location.lng);
            return distance <= radius;
        });
        filteredDeliveryPersons.sort((a, b) => {
            const distanceA = this.calculateDistance(location.lat, location.lng, a.location.lat, a.location.lng);
            const distanceB = this.calculateDistance(location.lat, location.lng, b.location.lat, b.location.lng);
            return distanceA - distanceB;
        });
        return filteredDeliveryPersons;
    }
    async findByZone(FindByZone) {
        const { zoneId } = FindByZone;
        const deliveryPersons = await this.deliveryPersonRepository
            .createQueryBuilder("deliveryPerson")
            .leftJoinAndSelect("deliveryPerson.zones", "zone")
            .where("zone.id = :zoneId", { zoneId })
            .getMany();
        return deliveryPersons;
    }
    async assignZone(id, assignZoneDto) {
        const { zoneIds } = assignZoneDto;
        const deliveryPerson = await this.deliveryPersonRepository.findOne({
            where: { id },
            relations: ["zones"],
        });
        if (!deliveryPerson) {
            return null;
        }
        const zones = await this.zoneService.findManyByIds(zoneIds);
        deliveryPerson.zones = [...(deliveryPerson.zones || []), ...zones];
        return this.deliveryPersonRepository.save(deliveryPerson);
    }
    async getZonesAssigned(deliveryPersonId) {
        const deliveryPerson = await this.deliveryPersonRepository.findOne({
            where: { id: deliveryPersonId },
            relations: ["zones"],
        });
        if (!deliveryPerson) {
            throw new Error(`Delivery person with ID ${deliveryPersonId} not found`);
        }
        return deliveryPerson.zones;
    }
    async unassignZone(deliveryPersonId, zoneId) {
        const deliveryPerson = await this.deliveryPersonRepository.findOneOrFail({
            where: { id: deliveryPersonId },
            relations: ["zones"],
        });
        const zone = await this.deliveryPersonRepository.manager
            .getRepository(zone_entity_1.Zone)
            .findOneOrFail({ where: { id: zoneId } });
        deliveryPerson.zones = deliveryPerson.zones.filter((z) => z.id !== zone.id);
        return await this.deliveryPersonRepository.save(deliveryPerson);
    }
    async remove(id) {
        await this.deliveryPersonRepository.delete(id);
    }
    async findByStatus(status) {
        return await this.deliveryPersonRepository.find({ where: { status } });
    }
    async findByLocation(location) {
        return await this.deliveryPersonRepository.find({ where: { location } });
    }
    async findByPersonId(personId) {
        return await this.deliveryPersonRepository.find({ where: { personId } });
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.DeliveryPersonService = DeliveryPersonService;
exports.DeliveryPersonService = DeliveryPersonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deliveryPerson_entity_1.DeliveryPersonEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        zone_service_1.ZoneService])
], DeliveryPersonService);
//# sourceMappingURL=deliveryPerson.service.js.map