import {
  Entity, Property, PrimaryKey, ManyToOne,
} from '@mikro-orm/core';
import { Board } from './Board';

@Entity({
  discriminatorColumn: 'type',
  discriminatorValue: 'item',
  abstract: true,
})
export default abstract class Item {
  constructor(
    tag: string,
    name: string,
    length: number,
    width: number,
    depth: number,
    diameter: number,
  ) {
    this.tag = tag;
    this.name = name;
    this.length = length;
    this.width = width;
    this.depth = depth;
    this.diameter = diameter;
  }

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

  // FIXME
  @ManyToOne(() => Board)
    board!: Board;
}
