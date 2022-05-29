import { Entity } from '@mikro-orm/core';
import StaticEquipment from './StaticEquipment';

@Entity({ discriminatorValue: 'tank' })
export default class Tank extends StaticEquipment {

}
