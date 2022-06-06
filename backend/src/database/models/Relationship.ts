import {
  Entity, OneToOne, PrimaryKeyType,
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

  @OneToOne({ nullable: false, orphanRemoval: true })
    firstItem!: Item;

  @OneToOne({ nullable: false, orphanRemoval: true })
    secondItem!: Item;
}
