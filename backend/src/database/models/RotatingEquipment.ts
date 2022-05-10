import { Entity, Property } from '@mikro-orm/core';
import { MechanicalEquipment } from './MechanicalEquipment';

@Entity()
export class RotatingEquipment extends MechanicalEquipment {
    @Property()
    preliminaryPower!: number;

    @Property()
    finalPower!: number;
}
 