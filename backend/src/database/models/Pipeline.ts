import { Entity, Property } from '@mikro-orm/core';
import PipeItem from './PipeItem';
import PressureClass from './PressureClass.enum';

@Entity({ discriminatorValue: 'pipeline' })
export default class Pipeline extends PipeItem {
  constructor(
    tag: string,
    name: string,
    length: number,
    width: number,
    depth: number,
    diameter: number,
    pressureClass: PressureClass,
    flange: string,
    lining: string,
    type: string,
  ) {
    super(tag, name, length, width, depth, diameter, pressureClass, type);
    this.flange = flange;
    this.lining = lining;
  }

  @Property({ nullable: true })
    flange?: string;

  @Property({ nullable: true })
    lining?: string;
}
