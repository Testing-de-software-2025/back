import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ZoneService } from "./zone.service";
import { Zone } from "./zone.entity";
import { AssignZone } from "./dto/AssignZone.dto";
import { CreateZone } from "./dto/CreateZone.dto";
import { UpdateZone } from "./dto/UpdateZone.dto";
import { UpdatePartialZone } from "./dto/UpdatePartialZone.dto";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { AuthGuard } from "../middlewares/auth.middleware";
import { Permissions } from "../middlewares/decorators/permissions.decorator";

@Controller("zones")
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @UseGuards(AuthGuard)
  @Permissions(["zone_read"])
  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{ zones: Zone[]; total: number }> {
    return this.zoneService.findAll(pagination);
  }

  @UseGuards(AuthGuard)
  @Permissions(["zone_create"])
  @Post()
  create(@Body() createZone: CreateZone) {
    return this.zoneService.create(createZone);
  }

  @UseGuards(AuthGuard)
  @Permissions(["zone_read"])
  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const zone = await this.zoneService.findOne(+id);
      if (!zone) {
        throw new HttpException("Zone not found", HttpStatus.NOT_FOUND);
      }
      return zone;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["zone_edit"])
  @Put(":id")
  async update(@Param("id") id: string, @Body() UpdateZoneDto: CreateZone) {
    try {
      const zone = await this.zoneService.update(+id, UpdateZoneDto);
      if (!zone) {
        throw new HttpException("Zone not found", HttpStatus.NOT_FOUND);
      }
      return zone;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["zone_edit"])
  @Patch(":id")
  async updatePartial(
    @Param("id") id: string,
    @Body() updateZoneDto: UpdatePartialZone,
  ) {
    try {
      const zone = await this.zoneService.updatePartial(+id, updateZoneDto);
      if (!zone) {
        throw new HttpException("Zone not found", HttpStatus.NOT_FOUND);
      }
      return zone;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["zone_delete"])
  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.zoneService.remove(+id);
      return { message: "Zone deleted successfully" };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
