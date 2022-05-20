import { Entity, Property } from '@mikro-orm/core';
import Item from './Item';

@Entity({ discriminatorValue: 'mechanicalEquipment' })
export default abstract class MechanicalEquipment extends Item {
  constructor(
    tag: string,
    name: string,
    length: number,
    width: number,
    depth: number,
    diameter: number,
    type: string,
    emptyMass: number,
    head: number,
    filledMass: number,
    netVolume: number,
    grossVolume: number,
  ) {
    super(tag, name, length, width, depth, diameter, type);
    this.emptyMass = emptyMass;
    this.head = head;
    this.filledMass = filledMass;
    this.netVolume = netVolume;
    this.grossVolume = grossVolume;
  }

  @Property({ type: 'float' })
    emptyMass?: number;

  @Property({ type: 'float' })
    head?: number;

  @Property({ type: 'float' })
    filledMass?: number;

  @Property({ type: 'float' })
    netVolume?: number;

  @Property({ type: 'float' })
    grossVolume?: number;
}
