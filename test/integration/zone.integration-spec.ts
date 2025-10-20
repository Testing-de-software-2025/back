import { Test, TestingModule } from "@nestjs/testing";
import { ZoneService } from "../../src/zone/zone.service";
import { ZoneModule } from "../../src/zone/zone.module";
import { AppModule } from "../../src/app.module";
import { DataSource } from "typeorm";

jest.setTimeout(30000);

describe("Zone Integration", () => {
  let module: TestingModule;
  let zoneService: ZoneService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule, ZoneModule],
    }).compile();

    zoneService = module.get<ZoneService>(ZoneService);
  });

  afterEach(async () => {
    try {
      const dataSource = module.get<DataSource>(DataSource);
      if (dataSource && dataSource.isInitialized) {
        await dataSource.query('DELETE FROM "delivery_zones_zone"');
        await dataSource.query('DELETE FROM "delivery"');
        await dataSource.query('DELETE FROM "zone"');
      }
    } catch {
      // ignore cleanup errors
    }
  });

  afterAll(async () => {
    try {
      const dataSource = module.get<DataSource>(DataSource);
      if (dataSource && dataSource.isInitialized) {
        await dataSource.query('DELETE FROM "delivery_zones_zone"');
        await dataSource.query('DELETE FROM "delivery"');
        await dataSource.query('DELETE FROM "zone"');
      }
    } catch {
      // ignore cleanup errors
    }
    await module.close();
  });

  it("create, findAll, findOne, update, remove", async () => {
    const createPayload = {
      name: "Centro",
      location: { lat: -31.41, lng: -64.2 },
      radius: 10,
    } as unknown as import("../../src/zone/dto/CreateZone.dto").CreateZone;
    const created = await zoneService.create(createPayload);
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();

    const pagination = {
      limit: 10,
      offset: 0,
    } as unknown as import("../../src/common/pagination/pagination.dto").PaginationDto;
    const all = await zoneService.findAll(pagination);
    expect(all.zones.length).toBeGreaterThanOrEqual(1);

    const one = await zoneService.findOne(created.id);
    expect(one).toBeDefined();
    expect(one.id).toEqual(created.id);

    const updatePayload = {
      name: "CentroUp",
    } as unknown as import("../../src/zone/dto/UpdateZone.dto").UpdateZone;
    const updated = await zoneService.update(created.id, updatePayload);
    expect(updated).toBeDefined();
    expect(updated!.name).toEqual("CentroUp");

    await expect(zoneService.remove(created.id)).resolves.toBeUndefined();
  });
});
