import {
  Entity, Property, PrimaryKey, OneToMany, Collection,
} from '@mikro-orm/core';
// eslint-disable-next-line
import Item from './Item';

@Entity()
export default class Board {
  constructor(
    name: string,
  ) {
    this.name = name;
  }

  @PrimaryKey({ autoincrement: true })
    id!: number;

  @Property({ nullable: false })
    name!: string;

  @OneToMany('Item', 'board')
    items = new Collection<Item>(this);
}
