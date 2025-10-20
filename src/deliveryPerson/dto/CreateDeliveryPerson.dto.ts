import { Type } from "class-transformer";
import { IsNumber, IsObject, ValidateNested } from "class-validator";
import { LocationDto } from "../../common/dto/Location.dto";

export class CreateDeliveryPerson {
  @IsNumber()
  personId: number;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  radius: number; // Radio en km cuadrado que cubre la zona
}
