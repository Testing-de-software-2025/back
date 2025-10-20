import { ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";

export class AssignZone {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  zoneIds: number[];
}
