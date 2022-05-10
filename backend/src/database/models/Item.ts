import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export abstract class Item {
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
}
