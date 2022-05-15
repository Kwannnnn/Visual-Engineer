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
  ) {
    super(tag, name, length, width, depth, diameter, pressureClass);
    this.flange = flange;
    this.lining = lining;
  }

  @Property()
    flange?: string;

  @Property()
    lining?: string;
}
