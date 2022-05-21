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
    super(tag, name, length, width, depth, diameter, emptyMass, head, filledMass, netVolume, grossVolume, type);
    this.preliminaryPower = preliminaryPower;
    this.finalPower = finalPower;
  }

  @Property({ nullable: true, type: 'float' })
    preliminaryPower!: number;

  @Property({ nullable: true, type: 'float' })
    finalPower!: number;
}
