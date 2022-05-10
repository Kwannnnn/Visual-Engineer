import { Entity, Property } from '@mikro-orm/core';
import { PipeItem } from './PipeItem';

@Entity()
export class Pipeline extends PipeItem {
  @Property({ nullable: false })
    flange!: string;

  @Property({ nullable: false })
    lining!: string;
}
