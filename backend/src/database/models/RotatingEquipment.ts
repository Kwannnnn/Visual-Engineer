import { Property } from '@mikro-orm/core';
import MechanicalEquipment from './MechanicalEquipment';

export default abstract class RotatingEquipment extends MechanicalEquipment {
  @Property()
    preliminaryPower!: number;

  @Property()
    finalPower!: number;
}
