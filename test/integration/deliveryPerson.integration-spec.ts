import { Test, TestingModule } from "@nestjs/testing";
import { DeliveryPersonService } from "../../src/deliveryPerson/deliveryPerson.service";
import { ZoneService } from "../../src/zone/zone.service";
import { DeliveryPersonModule } from "../../src/deliveryPerson/deliveryPerson.module";
import { ZoneModule } from "../../src/zone/zone.module";
import { AppModule } from "../../src/app.module";
import { DataSource } from "typeorm";
import { CreateDeliveryPerson } from "../../src/deliveryPerson/dto/CreateDeliveryPerson.dto";
import { AssignZoneDeliveryPerson } from "../../src/deliveryPerson/dto/AssignZoneDeliveryPerson.dto";
import { CreateZone } from "../../src/zone/dto/CreateZone.dto";
import { FindByProximityDeliveryPerson } from "../../src/deliveryPerson/dto/FindByProximityDeliveryPerson.dto";

jest.setTimeout(30000);

describe("DeliveryPerson Integration", () => {
  let module: TestingModule;
  let deliveryService: DeliveryPersonService;
  let zoneService: ZoneService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule, DeliveryPersonModule, ZoneModule],
    }).compile();

    deliveryService = module.get<DeliveryPersonService>(DeliveryPersonService);
    zoneService = module.get<ZoneService>(ZoneService);
  });

  afterEach(async () => {
    // cleanup after each test to keep tests isolated
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
    // cleanup: borrar datos creados por las pruebas y luego cerrar el módulo
    try {
      const dataSource = module.get<DataSource>(DataSource);
      if (dataSource && dataSource.isInitialized) {
        // borrar la tabla pivot primero
        await dataSource.query('DELETE FROM "delivery_zones_zone"');
        await dataSource.query('DELETE FROM "delivery"');
        await dataSource.query('DELETE FROM "zone"');
      }
    } catch {
      // no bloquear el cierre si hay errores en limpieza
    }
    await module.close();
  });

  it("create, assign zones, get zones assigned, unassign and unassignAll", async () => {
    const dpPayload: CreateDeliveryPerson = {
      personId: 1,
      location: { lat: 0, lng: 0 },
      radius: 1,
    };

    const dp = await deliveryService.create(dpPayload);

    expect(dp).toBeDefined();
    expect(dp.id).toBeDefined();

    const z1Payload: CreateZone = {
      name: "Z1",
      location: { lat: 0, lng: 0 },
      radius: 5,
    };
    const z2Payload: CreateZone = {
      name: "Z2",
      location: { lat: 1, lng: 1 },
      radius: 5,
    };

    const z1 = await zoneService.create(z1Payload);
    const z2 = await zoneService.create(z2Payload);

    const assignPayload: AssignZoneDeliveryPerson = { zoneIds: [z1.id, z2.id] };
    const assigned = await deliveryService.assignZone(dp.id, assignPayload);

    expect(assigned).toBeDefined();
    expect(assigned!.zones.length).toBeGreaterThanOrEqual(2);

    const zones = await deliveryService.getZonesAssigned(dp.id);
    expect(zones.length).toBeGreaterThanOrEqual(2);

    // unassign one
    const afterUnassign = await deliveryService.unassignZone(dp.id, z2.id);
    expect(afterUnassign.zones.find((z) => z.id === z2.id)).toBeUndefined();

    // unassign all
    const afterUnassignAll = await deliveryService.unassignAllZones(dp.id);
    expect(afterUnassignAll.zones).toEqual([]);
  });

  it("findByProximity filters and orders", async () => {
    // create some delivery persons
    const aPayload: CreateDeliveryPerson = {
      personId: 2,
      location: { lat: -31.41, lng: -64.2 },
      radius: 1,
    };
    const bPayload: CreateDeliveryPerson = {
      personId: 3,
      location: { lat: -32.0, lng: -64.0 },
      radius: 1,
    };
    const cPayload: CreateDeliveryPerson = {
      personId: 4,
      location: { lat: 10.0, lng: 10.0 },
      radius: 1,
    };

    const a = await deliveryService.create(aPayload);
    const b = await deliveryService.create(bPayload);
    await deliveryService.create(cPayload);

    const proximityPayload: FindByProximityDeliveryPerson = {
      location: { lat: -31.4, lng: -64.2 },
      radius: 3000,
    };
    const res = await deliveryService.findByProximity(proximityPayload);

    expect(Array.isArray(res)).toBe(true);
    expect(res.some((x) => x.id === a.id)).toBe(true);
    const ids = res.map((r) => r.id);
    expect(ids.indexOf(a.id)).toBeLessThan(ids.indexOf(b.id));
  });
});
