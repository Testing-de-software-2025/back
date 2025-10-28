import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DeliveryPersonService } from "./deliveryPerson.service";
import { DeliveryPersonEntity } from "./deliveryPerson.entity";
import { CreateDeliveryPerson } from "./dto/CreateDeliveryPerson.dto";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { AssignZoneDeliveryPerson } from "./dto/AssignZoneDeliveryPerson.dto";
import { FindByProximityDeliveryPerson } from "./dto/FindByProximityDeliveryPerson.dto";
import { ZoneService } from "../zone/zone.service";
import { Zone } from "../zone/zone.entity";

describe("DeliveryPersonService (unit)", () => {
  let service: DeliveryPersonService;
  let repo: Partial<Record<string, jest.Mock>> & {
    manager: { getRepository: jest.Mock };
  };
  let zoneServiceMock: Partial<Record<string, jest.Mock>>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOneOrFail: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      manager: {
        getRepository: jest.fn().mockReturnValue({ findOneOrFail: jest.fn() }),
      },
    } as unknown as typeof repo;

    zoneServiceMock = {
      findManyByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryPersonService,
        { provide: getRepositoryToken(DeliveryPersonEntity), useValue: repo },
        { provide: ZoneService, useValue: zoneServiceMock },
      ],
    }).compile();

    service = module.get<DeliveryPersonService>(DeliveryPersonService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("create() -> debe crear y devolver repartidor", async () => {
    const dto = {
      name: "Juan",
      location: { lat: 0, lng: 0 },
    } as unknown as CreateDeliveryPerson;
    const created = { ...dto };
    const saved = { id: 1, ...dto };

    (repo.create as jest.Mock).mockReturnValue(created);
    (repo.save as jest.Mock).mockResolvedValue(saved);

    await expect(service.create(dto)).resolves.toEqual(saved);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(created);
  });

  it("findAll() -> debe retornar array y total", async () => {
    const deliveries = [{ id: 1 }, { id: 2 }];
    (repo.findAndCount as jest.Mock).mockResolvedValue([deliveries, 2]);

    const res = await service.findAll({
      limit: 10,
      offset: 0,
    } as PaginationDto);
    expect(res).toEqual({ deliveries, total: 2 });
    expect(repo.findAndCount).toHaveBeenCalled();
  });

  it("findById() -> debe devolver el repartidor", async () => {
    const entity = { id: 1, name: "Juan" };
    (repo.findOneOrFail as jest.Mock).mockResolvedValue(entity);

    await expect(service.findById(1)).resolves.toEqual(entity);
    expect(repo.findOneOrFail).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ["zones"],
    });
  });

  it("assignZone() -> asigna zonas cuando existe repartidor", async () => {
    const id = 1;
    const assignDto = {
      zoneIds: [10, 20],
    } as unknown as AssignZoneDeliveryPerson;
    const deliveryPerson = { id, zones: [] };
    const zones = [{ id: 10 }, { id: 20 }];
    (repo.findOne as jest.Mock).mockResolvedValue(deliveryPerson);
    (zoneServiceMock.findManyByIds as jest.Mock).mockResolvedValue(zones);
    (repo.save as jest.Mock).mockResolvedValue({ id, zones });

    await expect(service.assignZone(id, assignDto)).resolves.toEqual({
      id,
      zones,
    });
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ["zones"],
    });
    expect(zoneServiceMock.findManyByIds).toHaveBeenCalledWith(
      assignDto.zoneIds,
    );
    expect(repo.save).toHaveBeenCalled();
  });

  it("assignZone() -> retorna null si no existe repartidor", async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    const res = await service.assignZone(999, {
      zoneIds: [1],
    } as AssignZoneDeliveryPerson);
    expect(res).toBeNull();
  });

  it("getZonesAssigned() -> devuelve zonas si existe", async () => {
    const dp = { id: 1, zones: [{ id: 5 }] };
    (repo.findOne as jest.Mock).mockResolvedValue(dp);

    await expect(service.getZonesAssigned(1)).resolves.toEqual(dp.zones);
  });

  it("unassignZone() -> quita una zona y guarda", async () => {
    const dp = {
      id: 1,
      zones: [{ id: 1 }, { id: 2 }],
      location: { lat: 0, lng: 0 },
    };
    const zoneToRemove = { id: 2 };
    (repo.findOneOrFail as jest.Mock).mockResolvedValue(dp);

    // mock manager.getRepository(Zone).findOneOrFail
    const fakeZoneRepo = {
      findOneOrFail: jest.fn().mockResolvedValue(zoneToRemove),
    };
    repo.manager.getRepository.mockReturnValue(fakeZoneRepo);

    (repo.save as jest.Mock).mockImplementation((x) => Promise.resolve(x));

    const res = await service.unassignZone(1, 2);
    expect(repo.findOneOrFail).toHaveBeenCalled();
    expect(repo.manager.getRepository).toHaveBeenCalledWith(Zone);
    expect(repo.save).toHaveBeenCalled();
    expect(res.zones.find((z) => z.id === 2)).toBeUndefined();
  });

  it("unassignAllZones() -> deja el array de zonas vacío", async () => {
    const dp = { id: 1, zones: [{ id: 1 }] };
    (repo.findOneOrFail as jest.Mock).mockResolvedValue(dp);
    (repo.save as jest.Mock).mockResolvedValue({ ...dp, zones: [] });

    const res = await service.unassignAllZones(1);
    expect(repo.findOneOrFail).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(res.zones).toEqual([]);
  });

  it("findByProximity() -> filtra y ordena por distancia", async () => {
    // punto base
    const base = { lat: -31.4, lng: -64.2 };
    const radius = 3000; // km (usar un valor grande para incluir)
    // tres repartidores: cerca, medio, lejos
    const a = { id: 1, location: { lat: -31.41, lng: -64.2 } };
    const b = { id: 2, location: { lat: -32.0, lng: -64.0 } };
    const c = { id: 3, location: { lat: 10.0, lng: 10.0 } };

    (repo.find as jest.Mock).mockResolvedValue([b, c, a]); // desordenado

    const res = await service.findByProximity({
      location: base,
      radius,
    } as FindByProximityDeliveryPerson);
    expect(Array.isArray(res)).toBe(true);
    // los que quedaron deben ser a y b (c fuera por lejanía en este ejemplo)
    expect(res.some((x) => x.id === 1)).toBe(true);
    // además deben venir ordenados por distancia (1 antes que 2)
    const ids = res.map((r) => r.id);
    const idx1 = ids.indexOf(1);
    const idx2 = ids.indexOf(2);
    expect(idx1).toBeLessThan(idx2);
  });
});
