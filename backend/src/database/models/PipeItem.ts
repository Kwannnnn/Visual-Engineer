import { Entity, Enum } from '@mikro-orm/core';
import PressureClass from './PressureClass.enum';
import Item from './Item';

@Entity()
export default class PipeItem extends Item {
  @Enum(() => PressureClass)
    pressureClass!: PressureClass;
}
