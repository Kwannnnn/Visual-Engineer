import { Property } from '@mikro-orm/core';
import Item from './Item';

export default abstract class MechanicalEquipment extends Item {
  @Property({ nullable: false })
    emptyMass!: number;

  @Property({ nullable: false })
    head!: number;

  @Property({ nullable: false })
    filledMass!: number;

  @Property({ nullable: false })
    netVolume!: number;

  @Property({ nullable: false })
    grossVolume!: number;
}
