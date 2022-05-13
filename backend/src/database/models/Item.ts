import {
  Property, PrimaryKey, ManyToOne, Entity,
} from '@mikro-orm/core';
import { Board } from './Board';

@Entity()
export class Item {
  @PrimaryKey()
    tag!: string;

  @Property({ nullable: false })
    name!: string;

  @Property({ nullable: false })
    length!: number;

  @Property({ nullable: false })
    width!: number;

  @Property({ nullable: false })
    depth!: number;

  @Property({ nullable: false })
    diameter!: number;

  @ManyToOne(() => Board)
    board!: Board;
}
