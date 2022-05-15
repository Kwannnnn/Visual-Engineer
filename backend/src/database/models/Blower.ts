import { Entity } from '@mikro-orm/core';
import RotatingEquipment from './RotatingEquipment';

@Entity({ discriminatorValue: 'blower' })
export default class Blower extends RotatingEquipment {

}
