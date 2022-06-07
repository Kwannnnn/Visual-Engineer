/* eslint-disable max-classes-per-file */
import {
  Property, PrimaryKey, ManyToOne, Entity,
} from '@mikro-orm/core';
import { ObjectProperty, PropertyType } from '../../util/properties';
// eslint-disable-next-line
import Board from './Board';

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
    type: string,
    x: number,
    y: number,
  ) {
    this.tag = tag;
    this.name = name;
    this.length = length;
    this.width = width;
    this.depth = depth;
    this.diameter = diameter;
    this.type = type;
    this.x = x;
    this.y = y;
  }

  @PrimaryKey({ nullable: false })
    tag!: string;

  @Property({ nullable: false })
    type!: string;

  @Property({ nullable: false })
  @ObjectProperty(PropertyType.STRING)
    name!: string;

  @Property({ nullable: false, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    length!: number;

  @Property({ nullable: false, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    width!: number;

  @Property({ nullable: false, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    depth!: number;

  @Property({ nullable: false, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    diameter!: number;

  @Property({ nullable: false, type: 'float' })
    x!: number;

  @Property({ nullable: false, type: 'float' })
    y!: number;

  @ManyToOne('Board')
    board!: Board;
}
