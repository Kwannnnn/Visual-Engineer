import { Entity, Property } from '@mikro-orm/core';
import Item from './Item';

@Entity({
  discriminatorValue: 'mechanicalEquipment',
  abstract: true,
})
export default abstract class MechanicalEquipment extends Item {
  constructor(
    tag: string,
    name: string,
    length: number,
    width: number,
    depth: number,
    diameter: number,
    emptyMass: number,
    head: number,
    filledMass: number,
    netVolume: number,
    grossVolume: number,
  ) {
    super(tag, name, length, width, depth, diameter);
    this.emptyMass = emptyMass;
    this.head = head;
    this.filledMass = filledMass;
    this.netVolume = netVolume;
    this.grossVolume = grossVolume;
  }

  @Property()
    emptyMass?: number;

  @Property()
    head?: number;

  @Property()
    filledMass?: number;

  @Property()
    netVolume?: number;

  @Property()
    grossVolume?: number;
}
