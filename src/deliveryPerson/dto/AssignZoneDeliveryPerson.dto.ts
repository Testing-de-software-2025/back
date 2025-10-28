import { IsArray, IsNumber } from "class-validator";

export class AssignZoneDeliveryPerson {
  @IsArray()
  @IsNumber({}, { each: true })
  zoneIds: number[]; // Array de IDs de zonas
}
