import {
  Entity, Property, PrimaryKey,
} from '@mikro-orm/core';

@Entity()
export default class Board {
  @PrimaryKey({ autoincrement: true })
    id!: number;

  @Property({ nullable: false })
    name!: string;

  // FIXME
  // @OneToMany('Item', 'board')
  //   items = new Collection<Item>(this);
}
