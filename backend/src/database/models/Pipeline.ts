import { Entity, Property } from '@mikro-orm/core';
import { ObjectProperty } from '../../util/properties';
import PropertyType from '../../util/properties/PropertyType';
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

  @ObjectProperty(PropertyType.STRING)
  @Property({ nullable: true })
    flange!: string;

  @ObjectProperty(PropertyType.STRING)
  @Property({ nullable: true })
    lining!: string;
}
