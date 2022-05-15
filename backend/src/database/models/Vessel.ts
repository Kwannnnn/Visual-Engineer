import { Entity } from '@mikro-orm/core';
import StaticEquipment from './StaticEquipment';

@Entity({ discriminatorValue: 'vessel' })
export default class Vessel extends StaticEquipment {

}
