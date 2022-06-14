import { Entity, Enum } from '@mikro-orm/core';
import PressureClass from './PressureClass.enum';
import Item from './Item';
import { ObjectProperty, PropertyType } from '../../util/properties';

@Entity({
  discriminatorValue: 'pipeItem',
})
export default abstract class PipeItem extends Item {
  constructor(
    tag: string,
    type: string,
    x: number,
    y: number,
    name?: string,
    length?: number,
    width?: number,
    depth?: number,
    diameter?: number,
    pressureClass?: PressureClass,
  ) {
    super(type, tag, x, y, name, length, width, depth, diameter);
    this.pressureClass = pressureClass;
  }

  @Enum({ items: () => PressureClass, nullable: true })
  @ObjectProperty(PropertyType.STRING)
    pressureClass?: PressureClass;
}
