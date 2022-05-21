import { Entity, Property } from '@mikro-orm/core';
import MechanicalEquipment from './MechanicalEquipment';

@Entity({ discriminatorValue: 'rotatingEquipment' })
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
  ) {
    // eslint-disable-next-line max-len
    super(tag, name, length, width, depth, diameter, type, emptyMass, head, filledMass, netVolume, grossVolume);
    this.preliminaryPower = preliminaryPower;
    this.finalPower = finalPower;
  }

  @Property({ type: 'float' })
    preliminaryPower?: number;

  @Property({ type: 'float' })
    finalPower?: number;
}
