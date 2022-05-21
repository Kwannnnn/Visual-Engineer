import { Entity, Enum } from '@mikro-orm/core';
import PressureClass from './PressureClass.enum';
import Item from './Item';

@Entity({
  discriminatorValue: 'pipeItem',
})
export default abstract class PipeItem extends Item {
  constructor(
    tag: string,
    name: string,
    length: number,
    width: number,
    depth: number,
    diameter: number,
    pressureClass: PressureClass,
    type: string,
  ) {
    super(tag, name, length, width, depth, diameter, type);
    this.pressureClass = pressureClass;
  }

  @Enum(() => PressureClass)
    pressureClass!: PressureClass;
}
