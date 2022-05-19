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
    type: string,
    pressureClass: PressureClass,
    flange: string,
    lining: string,
  ) {
    super(tag, name, length, width, depth, diameter, type, pressureClass);
    this.flange = flange;
    this.lining = lining;
  }

  @Property()
    flange?: string;

  @Property()
    lining?: string;
}
