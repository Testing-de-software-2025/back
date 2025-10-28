import { ZoneService } from "./zone.service";
import { Zone } from "./zone.entity";
import { CreateZone } from "./dto/CreateZone.dto";
import { UpdateZone } from "./dto/UpdateZone.dto";
import { UpdatePartialZone } from "./dto/UpdatePartialZone.dto";
import { PaginationDto } from "../common/pagination/pagination.dto";
export declare class ZoneController {
    private readonly zoneService;
    constructor(zoneService: ZoneService);
    findAll(pagination: PaginationDto): Promise<{
        zones: Zone[];
        total: number;
    }>;
    create(createZone: CreateZone): Promise<Zone>;
    findOne(id: string): Promise<Zone>;
    update(id: string, updateZoneDto: UpdateZone): Promise<Zone>;
    updatePartial(id: string, updateZoneDto: UpdatePartialZone): Promise<Zone>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
