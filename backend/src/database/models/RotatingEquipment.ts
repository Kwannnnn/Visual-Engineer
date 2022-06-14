import { Entity, Property } from '@mikro-orm/core';
import { ObjectProperty, PropertyType } from '../../util/properties';
import MechanicalEquipment from './MechanicalEquipment';

@Entity({
  discriminatorValue: 'rotatingEquipment',
})
export default abstract class RotatingEquipment extends MechanicalEquipment {
  constructor(
    tag: string,
    type: string,
    x: number,
    y: number,
    name?: string,
    length?: number,
    width?: number,
    depth?: number,
    diameter?: number,
    emptyMass?: number,
    head?: number,
    filledMass?: number,
    netVolume?: number,
    grossVolume?: number,
    preliminaryPower?: number,
    finalPower?: number,
  ) {
    // eslint-disable-next-line max-len
    super(type, tag, x, y, name, length, width, depth, diameter, emptyMass, head, filledMass, netVolume, grossVolume);
    this.preliminaryPower = preliminaryPower;
    this.finalPower = finalPower;
  }

  @Property({ nullable: true, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    preliminaryPower?: number;

  @Property({ nullable: true, type: 'float' })
  @ObjectProperty(PropertyType.STRING)
    finalPower?: number;
}
