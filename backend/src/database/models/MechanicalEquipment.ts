import { Entity, Property } from '@mikro-orm/core';
import Item from './Item';

@Entity({
  discriminatorValue: 'mechanicalEquipment',
})
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
    type: string,
  ) {
    super(tag, name, length, width, depth, diameter, type);
    this.emptyMass = emptyMass;
    this.head = head;
    this.filledMass = filledMass;
    this.netVolume = netVolume;
    this.grossVolume = grossVolume;
  }

<<<<<<< HEAD
  @Property({ nullable: true, type: 'float' })
    emptyMass!: number;

  @Property({ nullable: true, type: 'float' })
    head!: number;

  @Property({ nullable: true, type: 'float' })
    filledMass!: number;

  @Property({ nullable: true, type: 'float' })
    netVolume!: number;

  @Property({ nullable: true, type: 'float' })
    grossVolume!: number;
=======
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
>>>>>>> 4760a9cbb83e5e1f250f2e8bc395a9a00a5d42b1
}
