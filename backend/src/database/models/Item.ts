/* eslint-disable max-classes-per-file */
import {
  Property, PrimaryKey, ManyToOne, Entity, OneToMany, Collection, OneToOne, PrimaryKeyType,
} from '@mikro-orm/core';
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
  ) {
    this.tag = tag;
    this.name = name;
    this.length = length;
    this.width = width;
    this.depth = depth;
    this.diameter = diameter;
    this.type = type;
  }

  @PrimaryKey({ nullable: false })
    tag!: string;

  @Property({ nullable: false })
    type!: string;

  @Property({ nullable: false })
    name!: string;

  @Property({ nullable: false, type: 'float' })
    length!: number;

  @Property({ nullable: false, type: 'float' })
    width!: number;

  @Property({ nullable: false, type: 'float' })
    depth!: number;

  @Property({ nullable: false, type: 'float' })
    diameter!: number;

  @ManyToOne('Board')
    board!: Board;

  @OneToMany({ type: 'Relationship', mappedBy: 'firstItem' })
    relationship = new Collection<Relationship>(this);
}

@Entity()
export class Relationship {
  constructor(
    pipeline: Item,
    firstItem: Item,
    secondItem: Item,
  ) {
    this.pipeline = pipeline;
    this.firstItem = firstItem;
    this.secondItem = secondItem;
  }

  @OneToOne({ primary: true })
    pipeline!: Item;

  [PrimaryKeyType]?: string;

  @ManyToOne()
    firstItem!: Item;

  @ManyToOne()
    secondItem!: Item;
}
