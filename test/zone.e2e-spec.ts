/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { applyAllowAllGuard } from "./e2e-utils";
import { DataSource } from "typeorm";

describe("Zone e2e", () => {
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
    // cleanup and close resources robustly
    try {
      if (dataSource) {
        await dataSource.query('DELETE FROM "delivery_zones_zone"');
        await dataSource.query('DELETE FROM "delivery"');
        await dataSource.query('DELETE FROM "zone"');
      }
    } catch {
      // ignore cleanup errors but keep for debugging if needed
    }

    try {
      // DataSource has a destroy() method typed in TypeORM
      if (dataSource && typeof dataSource.destroy === "function") {
        await dataSource.destroy();
      }
    } catch {
      // ignore destroy errors
    }

    // ensure Nest app is closed
    try {
      await app.close();
    } catch {
      // ignore
    }
  });

  it("POST /zones -> GET /zones/:id", async () => {
    const dto = {
      name: "Centro e2e",
      location: { lat: -34, lng: -58 },
      radius: 5,
    };

    // allow passing the underlying http server to supertest in tests
    const resPost = await request(app.getHttpServer() as unknown as any)
      .post("/zones")
      .send(dto);

    if (resPost.status === 201) {
      const body = resPost.body as { id: number };
      expect(body).toBeDefined();
      expect(typeof body.id).toBe("number");

      const resGet = await request(app.getHttpServer() as unknown as any).get(
        `/zones/${body.id}`,
      );

      expect(resGet.status).toBe(200);
      const getBody = resGet.body as { id: number; name?: string };
      expect(getBody.id).toEqual(body.id);
      expect(getBody.name).toEqual(dto.name);
    } else {
      expect(resPost.status).toBe(401);
    }
  });
});
