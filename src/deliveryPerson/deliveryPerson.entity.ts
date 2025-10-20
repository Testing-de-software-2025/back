import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToMany, JoinTable } from "typeorm";
import { Zone } from "../zone/zone.entity";

export enum DeliveryPersonStatus {
  AVAILABLE = "available", //DISPONIBLE PARA PODER ACEPTAR UN PEDIDO
  IN_ROUTE = "in_route", //EN RUTA HACIA EL CLIENTE
  DELIVERING = "delivering", //ENTREGANDO EL PEDIDO, ESTA EN EL LUGAR DE ENTREGA
  WAITING_FOR_ORDER = "waiting_for_order", //ESTA ESPERANDO UN PEDIDO EN EL LOCAL
  UNAVAILABLE = "unavailable", //NO DISPONIBLE PARA ACEPTAR PEDIDOS
  WITH_ISSUE = "with_issue", //CON PROBLEMAS (transito, accidente, problemas con el vehiculo, etc)
  OFFLINE = "offline", //FUERA DE SERVICIO (NO DISPONIBLE PARA ACEPTAR PEDIDOS), CERRO SESION EN LA APP
}

@Entity("delivery")
export class DeliveryPersonEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "personid" })
  personId: number;

  @Column({ type: "jsonb" }) // Usamos JSON para almacenar el objeto de ubicación
  location: { lat: number; lng: number };

  @Column({ type: "decimal", precision: 10, scale: 3 })
  radius: number; // Radio en km cuadrado que cubre la zona

  @Column({
    type: "enum",
    enum: DeliveryPersonStatus,
    default: DeliveryPersonStatus.AVAILABLE,
  })
  status: DeliveryPersonStatus;

  @ManyToMany(() => Zone, (zone) => zone.deliveryPerson, { eager: true })
  @JoinTable()
  zones: Zone[];
}
