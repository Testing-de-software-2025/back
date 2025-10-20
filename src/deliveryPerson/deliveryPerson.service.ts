import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  DeliveryPersonEntity,
  DeliveryPersonStatus,
} from "./deliveryPerson.entity";
import { Zone } from "../zone/zone.entity";
import { ZoneService } from "../zone/zone.service";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { CreateDeliveryPerson } from "./dto/CreateDeliveryPerson.dto";
import { UpdateLocationDeliveryPerson } from "./dto/UpdateLocationDeliveryPerson.dto";
import { UpdateStatusDeliveryPerson } from "./dto/UpdateStatusDeliveryPerson.dto";
import { FindByProximityDeliveryPerson } from "./dto/FindByProximityDeliveryPerson.dto";
import { FindByZone } from "./dto/FindByZone.dto";
import { AssignZoneDeliveryPerson } from "./dto/AssignZoneDeliveryPerson.dto";
@Injectable()
export class DeliveryPersonService {
  async unassignAllZones(
    deliveryPersonId: number,
  ): Promise<DeliveryPersonEntity> {
    const deliveryPerson = await this.deliveryPersonRepository.findOneOrFail({
      where: { id: deliveryPersonId },
      relations: ["zones"],
    });
    deliveryPerson.zones = [];
    return await this.deliveryPersonRepository.save(deliveryPerson);
  }
  constructor(
    @InjectRepository(DeliveryPersonEntity)
    private readonly deliveryPersonRepository: Repository<DeliveryPersonEntity>,

    private readonly zoneService: ZoneService,
  ) {}

  async create(
    CreateDeliveryPerson: CreateDeliveryPerson,
  ): Promise<DeliveryPersonEntity> {
    const deliveryPerson =
      this.deliveryPersonRepository.create(CreateDeliveryPerson);
    return await this.deliveryPersonRepository.save(deliveryPerson);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ deliveries: DeliveryPersonEntity[]; total: number }> {
    const { limit, offset } = paginationDto;

    const [deliveries, total] =
      await this.deliveryPersonRepository.findAndCount({
        take: limit,
        skip: offset,
        relations: ["zones"],
      });
    return { deliveries, total };
  }

  async findById(id: number): Promise<DeliveryPersonEntity> {
    return await this.deliveryPersonRepository.findOneOrFail({
      where: { id },
      relations: ["zones"],
    });
  }
  /*
  async updateLocation(id: number, updateLocation: UpdateLocationDeliveryPerson): Promise<DeliveryPersonEntity> {
    await this.deliveryPersonRepository.update(id, updateLocation)
    return this.deliveryPersonRepository.findOneOrFail({ where: { id } })
  }
*/
  async updateLocation(
    id: number,
    updateLocation: UpdateLocationDeliveryPerson,
  ): Promise<DeliveryPersonEntity> {
    // Verificamos si existe y cargamos la entidad
    const deliveryPerson = await this.deliveryPersonRepository.findOne({
      where: { id },
    });
    if (!deliveryPerson) {
      throw new NotFoundException(`Delivery person with ID ${id} not found`);
    }

    // Actualizamos solo la propiedad necesaria
    Object.assign(deliveryPerson, updateLocation);

    // Save dispara hooks/eventos del ciclo de vida (@BeforeUpdate, etc.)
    return this.deliveryPersonRepository.save(deliveryPerson);
  }
  /*
  async updateStatus(id: number, updateStatusDto: UpdateStatusDeliveryPerson): Promise<DeliveryPersonEntity> {
    await this.deliveryPersonRepository.update(id, updateStatusDto)
    return this.deliveryPersonRepository.findOneOrFail({ where: { id } })
  }
*/
  async updateStatus(
    id: number,
    dto: UpdateStatusDeliveryPerson,
  ): Promise<DeliveryPersonEntity> {
    const entity = await this.deliveryPersonRepository.findOneOrFail({
      where: { id },
    });
    Object.assign(entity, dto);
    return this.deliveryPersonRepository.save(entity);
  }

  async findByProximity(
    findByProximityDto: FindByProximityDeliveryPerson,
  ): Promise<DeliveryPersonEntity[]> {
    const { location, radius } = findByProximityDto;

    // Obtener todos los repartidores
    const allDeliveryPersons = await this.deliveryPersonRepository.find();

    // Calcular la distancia y filtrar por radio
    const filteredDeliveryPersons = allDeliveryPersons.filter(
      (deliveryPerson) => {
        const distance = this.calculateDistance(
          location.lat,
          location.lng,
          deliveryPerson.location.lat,
          deliveryPerson.location.lng,
        );
        return distance <= radius;
      },
    );

    // Ordenar los repartidores filtrados por distancia
    filteredDeliveryPersons.sort((a, b) => {
      const distanceA = this.calculateDistance(
        location.lat,
        location.lng,
        a.location.lat,
        a.location.lng,
      );
      const distanceB = this.calculateDistance(
        location.lat,
        location.lng,
        b.location.lat,
        b.location.lng,
      );
      return distanceA - distanceB;
    });

    return filteredDeliveryPersons;
  }

  async findByZone(FindByZone: FindByZone): Promise<DeliveryPersonEntity[]> {
    const { zoneId } = FindByZone;

    // Encontrar los repartidores que están asignados a la zona especificada
    const deliveryPersons = await this.deliveryPersonRepository
      .createQueryBuilder("deliveryPerson")
      .leftJoinAndSelect("deliveryPerson.zones", "zone")
      .where("zone.id = :zoneId", { zoneId })
      .getMany();

    return deliveryPersons;
  }

  async assignZone(
    id: number,
    assignZoneDto: AssignZoneDeliveryPerson,
  ): Promise<DeliveryPersonEntity | null> {
    const { zoneIds } = assignZoneDto;

    // Buscar el repartidor
    const deliveryPerson = await this.deliveryPersonRepository.findOne({
      where: { id },
      relations: ["zones"],
    });

    if (!deliveryPerson) {
      return null;
    }

    // Buscar múltiples zonas con findManyByIds()
    const zones = await this.zoneService.findManyByIds(zoneIds);

    // aca se asignan las zonas al repartidor
    deliveryPerson.zones = [...(deliveryPerson.zones || []), ...zones];

    return this.deliveryPersonRepository.save(deliveryPerson);
  }

  async getZonesAssigned(deliveryPersonId: number): Promise<Zone[]> {
    const deliveryPerson = await this.deliveryPersonRepository.findOne({
      where: { id: deliveryPersonId },
      relations: ["zones"], // Cargamos la relación con zonas
    });

    if (!deliveryPerson) {
      throw new Error(`Delivery person with ID ${deliveryPersonId} not found`);
    }

    return deliveryPerson.zones;
  }

  async unassignZone(
    deliveryPersonId: number,
    zoneId: number,
  ): Promise<DeliveryPersonEntity> {
    // Trae el delivery con las zonas asociadas
    const deliveryPerson = await this.deliveryPersonRepository.findOneOrFail({
      where: { id: deliveryPersonId },
      relations: ["zones"],
    });
    // Trae la zona a eliminar
    const zone = await this.deliveryPersonRepository.manager
      .getRepository(Zone)
      .findOneOrFail({ where: { id: zoneId } });
    // Elimina la zona del array
    deliveryPerson.zones = deliveryPerson.zones.filter((z) => z.id !== zone.id);
    // Guarda el delivery actualizado
    return await this.deliveryPersonRepository.save(deliveryPerson);
  }

  async remove(id: number): Promise<void> {
    await this.deliveryPersonRepository.delete(id);
  }

  async findByStatus(
    status: DeliveryPersonStatus,
  ): Promise<DeliveryPersonEntity[]> {
    return await this.deliveryPersonRepository.find({ where: { status } });
  }

  async findByLocation(location: {
    lat: number;
    lng: number;
  }): Promise<DeliveryPersonEntity[]> {
    return await this.deliveryPersonRepository.find({ where: { location } });
  }

  async findByPersonId(personId: number): Promise<DeliveryPersonEntity[]> {
    return await this.deliveryPersonRepository.find({ where: { personId } });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
