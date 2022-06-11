import {
  Entity, ManyToOne, OneToOne, PrimaryKeyType,
} from '@mikro-orm/core';
import Item from './Item';
import Pipeline from './Pipeline';

@Entity()
export default class Relationship {
  constructor(
    pipeline: Pipeline,
    firstItem: Item,
    secondItem: Item,
  ) {
    this.pipeline = pipeline;
    this.firstItem = firstItem;
    this.secondItem = secondItem;
  }

  @OneToOne({ primary: true })
    pipeline!: Pipeline;

  [PrimaryKeyType]?: string;

  @ManyToOne({ nullable: false, onDelete: 'cascade' })
    firstItem!: Item;

  @ManyToOne({ nullable: false, onDelete: 'cascade' })
    secondItem!: Item;
}
