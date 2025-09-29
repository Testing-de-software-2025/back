import { DeliveryPersonService } from './deliveryPerson.service';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { CreateDeliveryPerson } from './dto/CreateDeliveryPerson.dto';
import { UpdateLocationDeliveryPerson } from './dto/UpdateLocationDeliveryPerson.dto';
import { UpdateStatusDeliveryPerson } from './dto/UpdateStatusDeliveryPerson.dto';
import { FindByProximityDeliveryPerson } from './dto/FindByProximityDeliveryPerson.dto';
import { FindByZone } from './dto/FindByZone.dto';
import { AssignZoneDeliveryPerson } from './dto/AssignZoneDeliveryPerson.dto';
import { DeliveryPersonEntity } from './deliveryPerson.entity';
export declare class DeliveryPersonController {
    private readonly deliveryPersonService;
    constructor(deliveryPersonService: DeliveryPersonService);
    create(CreateDeliveryPerson: CreateDeliveryPerson): Promise<DeliveryPersonEntity>;
    findall(paginationDto: PaginationDto): Promise<{
        deliveries: DeliveryPersonEntity[];
        total: number;
    }>;
    findOne(id: number): Promise<DeliveryPersonEntity>;
    updateLocation(id: string, updateLocationDto: UpdateLocationDeliveryPerson): Promise<DeliveryPersonEntity>;
    updateStatus(id: string, updateStatusDto: UpdateStatusDeliveryPerson): Promise<DeliveryPersonEntity>;
    findByProximity(findByProximityDto: FindByProximityDeliveryPerson): Promise<DeliveryPersonEntity[]>;
    findByZone(FindByZone: FindByZone): Promise<DeliveryPersonEntity[]>;
    assignZone(id: string, assignZoneDto: AssignZoneDeliveryPerson): Promise<DeliveryPersonEntity>;
    getZonesAssigned(id: number): Promise<import("../zone/zone.entity").Zone[]>;
    removeZone(id: string, zoneId: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
