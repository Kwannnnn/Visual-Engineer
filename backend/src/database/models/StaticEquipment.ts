import { Entity } from '@mikro-orm/core';
import MechanicalEquipment from './MechanicalEquipment';

@Entity({
  discriminatorValue: 'staticEquipment',
  abstract: true,
})
export default abstract class StaticEquipment extends MechanicalEquipment {

}
