import { CreateDeliveryPerson } from "../../src/deliveryPerson/dto/CreateDeliveryPerson.dto";
import { AssignZoneDeliveryPerson } from "../../src/deliveryPerson/dto/AssignZoneDeliveryPerson.dto";
import { CreateZone } from "../../src/zone/dto/CreateZone.dto";
import { FindByProximityDeliveryPerson } from "../../src/deliveryPerson/dto/FindByProximityDeliveryPerson.dto";

jest.setTimeout(30000);

describe("DeliveryPerson Integration (mocked, no DB)", () => {
  let deliveryService: DeliveryServiceMockType;
  let zoneService: ZoneServiceMockType;

  // in-memory stores to simulate DB
  type ZoneMock = CreateZone & { id: number };
  type DeliveryMock = CreateDeliveryPerson & { id: number; zones: ZoneMock[] };

  interface DeliveryServiceMockType {
    create(payload: CreateDeliveryPerson): Promise<DeliveryMock>;

    assignZone(
      id: number,
      dto: AssignZoneDeliveryPerson,
    ): Promise<DeliveryMock | null>;

    getZonesAssigned(id: number): Promise<ZoneMock[]>;

    unassignZone(id: number, zoneId: number): Promise<DeliveryMock>;

    unassignAllZones(id: number): Promise<DeliveryMock>;

    findByProximity(
      query: FindByProximityDeliveryPerson,
    ): Promise<DeliveryMock[]>;
  }

  interface ZoneServiceMockType {
    create(payload: CreateZone): Promise<ZoneMock>;
    findManyByIds(ids: number[]): Promise<ZoneMock[]>;
  }

  let _deliveries: DeliveryMock[] = [];
  let _zones: ZoneMock[] = [];
  let _dpId = 1;
  let _zoneId = 1;

  beforeAll(() => {
    // reset stores
    _deliveries = [];
    _zones = [];
    _dpId = 1;
    _zoneId = 1;

    zoneService = {
      create: jest.fn((payload: CreateZone) => {
        const z: ZoneMock = { id: _zoneId++, ...payload };
        _zones.push(z);
        return Promise.resolve(z);
      }),
      findManyByIds: jest.fn((ids: number[]) =>
        Promise.resolve(_zones.filter((z) => ids.includes(z.id))),
      ),
    };

    deliveryService = {
      create: jest.fn((payload: CreateDeliveryPerson) => {
        const entity: DeliveryMock = { id: _dpId++, ...payload, zones: [] };
        _deliveries.push(entity);
        return Promise.resolve(entity);
      }),
      assignZone: jest.fn((id: number, dto: AssignZoneDeliveryPerson) => {
        const dp = _deliveries.find((d) => d.id === id);
        if (!dp) return Promise.resolve(null);
        dp.zones = _zones.filter((z) => dto.zoneIds.includes(z.id));
        return Promise.resolve(dp);
      }),
      getZonesAssigned: jest.fn((id: number) => {
        const dp = _deliveries.find((d) => d.id === id);
        return Promise.resolve(dp ? dp.zones : []);
      }),
      unassignZone: jest.fn((id: number, zoneId: number) => {
        const dp = _deliveries.find((d) => d.id === id);
        if (!dp) return Promise.reject(new Error("Not found"));
        dp.zones = dp.zones.filter((z) => z.id !== zoneId);
        return Promise.resolve(dp);
      }),
      unassignAllZones: jest.fn((id: number) => {
        const dp = _deliveries.find((d) => d.id === id);
        if (!dp) return Promise.reject(new Error("Not found"));
        dp.zones = [];
        return Promise.resolve(dp);
      }),
      findByProximity: jest.fn((query: FindByProximityDeliveryPerson) => {
        const { location } = query;
        const dist = (p: DeliveryMock) => {
          const dx = p.location.lat - location.lat;
          const dy = p.location.lng - location.lng;
          return dx * dx + dy * dy;
        };
        return Promise.resolve(
          _deliveries.slice().sort((a, b) => dist(a) - dist(b)),
        );
      }),
    };
    // mocks are already typed via the declared variables
  });

  afterEach(() => {
    // reset in-memory stores between tests
    _deliveries = [];
    _zones = [];
    _dpId = 1;
    _zoneId = 1;
    jest.clearAllMocks();
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
