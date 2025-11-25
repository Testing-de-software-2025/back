import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "./entities";
import { ZoneModule } from "./zone/zone.module";
import { DeliveryPersonModule } from "./deliveryPerson/deliveryPerson.module";

// Parametrizamos la conexión a Postgres mediante variables de entorno
// para facilitar ejecución en CI y entornos locales.
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.POSTGRES_PORT || "5434", 10),
      database: process.env.POSTGRES_DB || "delivery-zona",
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "postgres",
      // Por seguridad, allow toggle de synchronize desde env (usar "false" en CI/producción si se usan migraciones)
      synchronize: process.env.TYPEORM_SYNCHRONIZE !== "false",
      entities,
      logging: process.env.TYPEORM_LOGGING === "true",
    }),
    ZoneModule,
    DeliveryPersonModule,
  ],
})
export class AppModule {}
