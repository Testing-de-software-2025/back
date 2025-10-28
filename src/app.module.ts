import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "./entities";
import { ZoneModule } from "./zone/zone.module";
import { DeliveryPersonModule } from "./deliveryPerson/deliveryPerson.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5433,
      database: "deliveryzona",
      username: "postgres",
      password: "postgres",
      synchronize: true,
      entities,
      logging: true,
    }),
    ZoneModule,
    DeliveryPersonModule,
  ],
})
export class AppModule {}
