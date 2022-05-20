import { Entity, Property } from '@mikro-orm/core';
import MechanicalEquipment from './MechanicalEquipment';

@Entity({
  discriminatorValue: 'rotatingEquipment',
})
export default abstract class RotatingEquipment extends MechanicalEquipment {
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
    preliminaryPower: number,
    finalPower: number,
    type: string,
  ) {
    // eslint-disable-next-line max-len
<<<<<<< HEAD
    super(tag, name, length, width, depth, diameter, emptyMass, head, filledMass, netVolume, grossVolume, type);
=======
    super(tag, name, length, width, depth, diameter, type, emptyMass, head, filledMass, netVolume, grossVolume);
>>>>>>> 4760a9cbb83e5e1f250f2e8bc395a9a00a5d42b1
    this.preliminaryPower = preliminaryPower;
    this.finalPower = finalPower;
  }

<<<<<<< HEAD
  @Property({ nullable: true, type: 'float' })
    preliminaryPower!: number;

  @Property({ nullable: true, type: 'float' })
    finalPower!: number;
=======
  @Property({ type: 'float' })
    preliminaryPower?: number;

  @Property({ type: 'float' })
    finalPower?: number;
>>>>>>> 4760a9cbb83e5e1f250f2e8bc395a9a00a5d42b1
}
