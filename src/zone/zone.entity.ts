import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DeliveryPersonEntity } from "../deliveryPerson/deliveryPerson.entity";

@Entity("zone")
export class Zone extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "jsonb" }) // Usamos JSON para almacenar el objeto de ubicación
  location: { lat: number; lng: number };

  @Column({ type: "decimal", precision: 10, scale: 3 })
  radius: number; //numero porque es radio en km, radio en km cuadradros que cubre la zona

  @ManyToMany(
    () => DeliveryPersonEntity,
    (deliveryPerson) => deliveryPerson.zones,
    { onDelete: "CASCADE" },
  )
  deliveryPerson: DeliveryPersonEntity[];
}
