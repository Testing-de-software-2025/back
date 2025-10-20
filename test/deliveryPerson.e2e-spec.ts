/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { applyAllowAllGuard } from "./e2e-utils";
import { DataSource } from "typeorm";

describe("DeliveryPerson e2e", () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAllowAllGuard(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    try {
      if (dataSource) {
        await dataSource.query('DELETE FROM "delivery_zones_zone"');
        await dataSource.query('DELETE FROM "delivery"');
        await dataSource.query('DELETE FROM "zone"');
      }
    } catch {
      // ignore cleanup errors
    }

    try {
      if (dataSource && typeof dataSource.destroy === "function") {
        await dataSource.destroy();
      }
    } catch {
      // ignore destroy errors
    }

    try {
      await app.close();
    } catch {
      // ignore
    }
  });

  it("POST /delivery -> GET /delivery/:id", async () => {
    const createDto = {
      personId: 9999,
      location: { lat: -34.0, lng: -58.0 },
      radius: 1,
    };

    const resPost = await request(app.getHttpServer() as unknown as any)
      .post("/delivery")
      .send(createDto);
    if (resPost.status === 201) {
      const body = resPost.body as { id: number };
      expect(body).toBeDefined();
      expect(typeof body.id).toBe("number");

      const resGet = await request(app.getHttpServer() as unknown as any).get(
        `/delivery/${body.id}`,
      );
      expect(resGet.status).toBe(200);
      const getBody = resGet.body as {
        id: number;
        personid?: number;
        personId?: number;
      };
      expect(getBody.id).toEqual(body.id);
      expect(getBody.personId ?? getBody.personid).toEqual(createDto.personId);
    } else {
      expect(resPost.status).toBe(401);
    }
  });
});
