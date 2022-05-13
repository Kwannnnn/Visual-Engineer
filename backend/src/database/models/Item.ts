import {
  Property, PrimaryKey, ManyToOne,
} from '@mikro-orm/core';
import Board from './Board';

export default abstract class Item {
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
