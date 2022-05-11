import { Enum } from '@mikro-orm/core';
import { Item } from './Item';

export abstract class PipeItem extends Item {
  @Enum(() => PressureClass)
    pressureClass!: PressureClass;
}

export enum PressureClass {
  PN10,
  PN25,
  PN50,
  PN100,
}
