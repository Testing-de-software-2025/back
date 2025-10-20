import { IsEnum } from "class-validator";
import { DeliveryPersonStatus } from "../deliveryPerson.entity";

export class UpdateStatusDeliveryPerson {
  @IsEnum(DeliveryPersonStatus)
  status: DeliveryPersonStatus;
}
