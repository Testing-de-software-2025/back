import {
  IsString,
  IsNumber,
  IsObject,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { LocationDto } from "../../common/dto/Location.dto";

export class CreateZone {
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  radius: number;

  @IsOptional()
  deliveryPersonId?: number; // Opcional, si se asigna una zona a un repartidor
}
