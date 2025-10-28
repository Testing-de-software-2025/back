import { Repository } from "typeorm";
import { DeliveryPersonEntity, DeliveryPersonStatus } from "./deliveryPerson.entity";
import { Zone } from "../zone/zone.entity";
import { ZoneService } from "../zone/zone.service";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { CreateDeliveryPerson } from "./dto/CreateDeliveryPerson.dto";
import { UpdateLocationDeliveryPerson } from "./dto/UpdateLocationDeliveryPerson.dto";
import { UpdateStatusDeliveryPerson } from "./dto/UpdateStatusDeliveryPerson.dto";
import { FindByProximityDeliveryPerson } from "./dto/FindByProximityDeliveryPerson.dto";
import { FindByZone } from "./dto/FindByZone.dto";
import { AssignZoneDeliveryPerson } from "./dto/AssignZoneDeliveryPerson.dto";
export declare class DeliveryPersonService {
    private readonly deliveryPersonRepository;
    private readonly zoneService;
    unassignAllZones(deliveryPersonId: number): Promise<DeliveryPersonEntity>;
    constructor(deliveryPersonRepository: Repository<DeliveryPersonEntity>, zoneService: ZoneService);
    create(CreateDeliveryPerson: CreateDeliveryPerson): Promise<DeliveryPersonEntity>;
    findAll(paginationDto: PaginationDto): Promise<{
        deliveries: DeliveryPersonEntity[];
        total: number;
    }>;
    findById(id: number): Promise<DeliveryPersonEntity>;
    updateLocation(id: number, updateLocation: UpdateLocationDeliveryPerson): Promise<DeliveryPersonEntity>;
    updateStatus(id: number, dto: UpdateStatusDeliveryPerson): Promise<DeliveryPersonEntity>;
    findByProximity(findByProximityDto: FindByProximityDeliveryPerson): Promise<DeliveryPersonEntity[]>;
    findByZone(FindByZone: FindByZone): Promise<DeliveryPersonEntity[]>;
    assignZone(id: number, assignZoneDto: AssignZoneDeliveryPerson): Promise<DeliveryPersonEntity | null>;
    getZonesAssigned(deliveryPersonId: number): Promise<Zone[]>;
    unassignZone(deliveryPersonId: number, zoneId: number): Promise<DeliveryPersonEntity>;
    remove(id: number): Promise<void>;
    findByStatus(status: DeliveryPersonStatus): Promise<DeliveryPersonEntity[]>;
    findByLocation(location: {
        lat: number;
        lng: number;
    }): Promise<DeliveryPersonEntity[]>;
    findByPersonId(personId: number): Promise<DeliveryPersonEntity[]>;
    private calculateDistance;
    private deg2rad;
}
