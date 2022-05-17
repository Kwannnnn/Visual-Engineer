import { Entity } from '@mikro-orm/core';
import MechanicalEquipment from './MechanicalEquipment';

@Entity({
  discriminatorValue: 'staticEquipment',
})
export default abstract class StaticEquipment extends MechanicalEquipment {

}
