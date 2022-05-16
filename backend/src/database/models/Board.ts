import {
  Entity, Property, PrimaryKey, OneToMany, Collection,
} from '@mikro-orm/core';
import Item from './Item';

@Entity()
export class Board {
  constructor(
    name: string
  ) {
    this.name = name; 
  }
  
  @PrimaryKey({ autoincrement: true })
    id!: number;

  @Property({ nullable: false })
    name!: string;

  // FIXME
  @OneToMany('Item', 'board')
    items = new Collection<Item>(this);
}
