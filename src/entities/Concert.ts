import {
  BaseEntity,
  Column,
  OneToMany,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";

import Location from "./Location";
import Orchestra from "./Orchestra";
import ConcertTag from "./ConcertTag";
import Performance from "./Performance";
import Conductor from "./Conductor";

@Entity("concert", { name: "concerts" })
export default class Concert extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  concert_id: string;

  @Column("date", { nullable: true })
  date: string;

  @Column("time", { nullable: true })
  starting_time: string;

  @Column({ nullable: true })
  footnote: string;

  @Column({ nullable: true })
  archive_info: string;

  @Column({ nullable: true })
  conductor_unknown: boolean;

  @ManyToOne(() => Location, { onDelete: "CASCADE" })
  location: Location;

  @ManyToOne(() => Orchestra, { onDelete: "CASCADE" })
  orchestra: Orchestra;

  @ManyToOne(() => ConcertTag, { onDelete: "CASCADE" })
  concert_tag: ConcertTag;

  @ManyToMany(() => Conductor, (conductor) => conductor.concerts, { onDelete: "CASCADE" })
  @JoinTable()
  conductors: Conductor[];

  @OneToMany(() => Performance, (performances) => performances.concert, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  performances: Performance[];
}
