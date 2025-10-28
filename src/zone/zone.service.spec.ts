import { Test, TestingModule } from "@nestjs/testing";
import { ZoneService } from "./zone.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Zone } from "./zone.entity";
import { CreateZone } from "./dto/CreateZone.dto";
import { UpdateZone } from "./dto/UpdateZone.dto";
import { PaginationDto } from "../common/pagination/pagination.dto";

describe("ZoneService (unit)", () => {
  let service: ZoneService;
  const mockRepo = {
    findAndCount: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZoneService,
        { provide: getRepositoryToken(Zone), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ZoneService>(ZoneService);
    jest.clearAllMocks();
  });

  it("create() -> debe crear y guardar zona", async () => {
    const dto = {
      name: "Centro",
      radius: 5,
    } as unknown as CreateZone;
    const created = { ...dto };
    const saved = { id: 1, ...dto };
    mockRepo.create.mockReturnValue(created);
    mockRepo.save.mockResolvedValue(saved);

    await expect(service.create(dto)).resolves.toEqual(saved);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(created);
  });

  it("findAll() -> devuelve zonas y total", async () => {
    const zones = [{ id: 1 }];
    mockRepo.findAndCount.mockResolvedValue([zones, 1]);
    const res = await service.findAll({
      limit: 10,
      offset: 0,
    } as PaginationDto);
    expect(res).toEqual({ zones, total: 1 });
    expect(mockRepo.findAndCount).toHaveBeenCalled();
  });

  it("findOne() -> devuelve zona", async () => {
    const z = { id: 1, name: "A" };
    mockRepo.findOneOrFail.mockResolvedValue(z);
    await expect(service.findOne(1)).resolves.toEqual(z);
  });

  it("findManyByIds() -> devuelve las zonas pedidas", async () => {
    const data = [{ id: 1 }, { id: 2 }];
    mockRepo.find.mockResolvedValue(data);
    await expect(service.findManyByIds([1, 2])).resolves.toEqual(data);
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it("update() -> actualiza y devuelve entity", async () => {
    mockRepo.update.mockResolvedValue(undefined);
    mockRepo.findOne.mockResolvedValue({ id: 1, name: "updated" });
    await expect(
      service.update(1, { name: "updated" } as unknown as UpdateZone),
    ).resolves.toEqual({ id: 1, name: "updated" });
    expect(mockRepo.update).toHaveBeenCalledWith(1, { name: "updated" });
  });

  it("remove() -> llama a delete", async () => {
    mockRepo.delete.mockResolvedValue(undefined);
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });
});
