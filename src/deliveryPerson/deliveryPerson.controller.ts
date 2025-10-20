import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpException,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DeliveryPersonService } from "./deliveryPerson.service";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { CreateDeliveryPerson } from "./dto/CreateDeliveryPerson.dto";
import { UpdateLocationDeliveryPerson } from "./dto/UpdateLocationDeliveryPerson.dto";
import { UpdateStatusDeliveryPerson } from "./dto/UpdateStatusDeliveryPerson.dto";
import { FindByProximityDeliveryPerson } from "./dto/FindByProximityDeliveryPerson.dto";
import { FindByZone } from "./dto/FindByZone.dto";
import { AssignZoneDeliveryPerson } from "./dto/AssignZoneDeliveryPerson.dto";
import { Permissions } from "../middlewares/decorators/permissions.decorator";
import { AuthGuard } from "../middlewares/auth.middleware";
import { DeliveryPersonEntity } from "./deliveryPerson.entity";

@Controller("delivery")
export class DeliveryPersonController {
  // deliveryService: any; // No se usa
  constructor(private readonly deliveryPersonService: DeliveryPersonService) {}

  @UseGuards(AuthGuard)
  @Permissions(["delivery_create"])
  @Post()
  async create(@Body() CreateDeliveryPerson: CreateDeliveryPerson) {
    try {
      return await this.deliveryPersonService.create(CreateDeliveryPerson);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_read"])
  @Get()
  async findall(@Query() paginationDto: PaginationDto) {
    try {
      return await this.deliveryPersonService.findAll(paginationDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @UseGuards(AuthGuard)
  @Permissions(["delivery_read"])
  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<DeliveryPersonEntity> {
    try {
      return await this.deliveryPersonService.findById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_edit"])
  @Put(":id/location")
  async updateLocation(
    @Param("id") id: string,
    @Body() updateLocationDto: UpdateLocationDeliveryPerson,
  ) {
    try {
      const deliveryPerson = await this.deliveryPersonService.updateLocation(
        +id,
        updateLocationDto,
      );
      if (!deliveryPerson) {
        throw new HttpException(
          "Delivery person not found",
          HttpStatus.NOT_FOUND,
        );
      }
      return deliveryPerson;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_edit"])
  @Put(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() updateStatusDto: UpdateStatusDeliveryPerson,
  ) {
    try {
      const deliveryPerson = await this.deliveryPersonService.updateStatus(
        +id,
        updateStatusDto,
      );
      if (!deliveryPerson) {
        throw new HttpException(
          "Delivery person not found",
          HttpStatus.NOT_FOUND,
        );
      }
      return deliveryPerson;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_read", "delivery_zone_assignment"])
  @Post("findByProximity")
  async findByProximity(
    @Body() findByProximityDto: FindByProximityDeliveryPerson,
  ) {
    try {
      return await this.deliveryPersonService.findByProximity(
        findByProximityDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_read", "delivery_zone_assignment"])
  @Post("findByZone")
  async findByZone(@Body() FindByZone: FindByZone) {
    try {
      return await this.deliveryPersonService.findByZone(FindByZone);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_zone_assignment"])
  @Post(":id/assignZone")
  async assignZone(
    @Param("id") id: string,
    @Body() assignZoneDto: AssignZoneDeliveryPerson,
  ) {
    try {
      const deliveryPerson = await this.deliveryPersonService.assignZone(
        +id,
        assignZoneDto,
      );
      if (!deliveryPerson) {
        throw new HttpException(
          "Delivery person not found",
          HttpStatus.NOT_FOUND,
        );
      }
      return deliveryPerson;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_read"])
  @Get(":id/zones")
  async getZonesAssigned(@Param("id", ParseIntPipe) id: number) {
    try {
      const zones = await this.deliveryPersonService.getZonesAssigned(id);

      if (!zones.length) {
        throw new HttpException(
          "No zones found for this delivery person",
          HttpStatus.NOT_FOUND,
        );
      }

      return zones;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_zone_assignment"])
  @Delete(":id/zone/:zoneId")
  async removeZone(@Param("id") id: string, @Param("zoneId") zoneId: string) {
    try {
      await this.deliveryPersonService.unassignZone(+id, +zoneId);
      return { message: "Zone removed from delivery" };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Permissions(["delivery_delete"])
  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.deliveryPersonService.remove(+id);
      return { message: "Delivery deleted" };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
