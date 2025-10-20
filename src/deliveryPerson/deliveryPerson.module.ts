import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryPersonService } from "./deliveryPerson.service";
import { DeliveryPersonController } from "./deliveryPerson.controller";
import { DeliveryPersonEntity } from "./deliveryPerson.entity";
import { ZoneModule } from "../zone/zone.module";

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryPersonEntity]), ZoneModule],
  controllers: [DeliveryPersonController],
  providers: [DeliveryPersonService],
  exports: [TypeOrmModule],
})
export class DeliveryPersonModule {}
