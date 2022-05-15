import { Entity } from '@mikro-orm/core';
import RotatingEquipment from './RotatingEquipment';

@Entity({ discriminatorValue: 'pump' })
export default class Pump extends RotatingEquipment {

}
