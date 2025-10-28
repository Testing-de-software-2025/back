import type { Repository } from "typeorm";
import { Zone } from "./zone.entity";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { CreateZone } from "./dto/CreateZone.dto";
import { UpdateZone } from "./dto/UpdateZone.dto";
import { UpdatePartialZone } from "./dto/UpdatePartialZone.dto";
export declare class ZoneService {
    private readonly zoneRepository;
    constructor(zoneRepository: Repository<Zone>);
    findAll(Pagination: PaginationDto): Promise<{
        zones: Zone[];
        total: number;
    }>;
    findOne(id: number): Promise<Zone>;
    findManyByIds(zoneIds: number[]): Promise<Zone[]>;
    create(CreateZone: CreateZone): Promise<Zone>;
    update(id: number, UpdateZone: UpdateZone): Promise<Zone | null>;
    updatePartial(id: number, UpdateZone: UpdatePartialZone): Promise<Zone | null>;
    remove(id: number): Promise<void>;
}
