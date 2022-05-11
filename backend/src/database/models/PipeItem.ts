import { Enum } from '@mikro-orm/core';
import PressureClass from './PressureClass.enum';
import Item from './Item';

export default abstract class PipeItem extends Item {
  @Enum(() => PressureClass)
    pressureClass!: PressureClass;
}
