import { Property } from '@mikro-orm/core';
import { MechanicalEquipment } from './MechanicalEquipment';

export abstract class RotatingEquipment extends MechanicalEquipment {
    @Property()
    preliminaryPower!: number;

    @Property()
    finalPower!: number;
}
 