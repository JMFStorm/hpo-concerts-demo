import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("location", { name: "locations" })
export default class Location extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
}
