import { IsString, IsNumber, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { LocationDto } from "../../common/dto/Location.dto";

export class UpdatePartialZone {
  @IsString()
  name?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  radius?: number;
}
