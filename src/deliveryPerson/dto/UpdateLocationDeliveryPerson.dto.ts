import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { LocationDto } from "../../common/dto/Location.dto";

export class UpdateLocationDeliveryPerson {
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
