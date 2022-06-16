import { Entity, Property } from '@mikro-orm/core';
import { ObjectProperty, PropertyType } from '../../util/properties';
import Item from './Item';

@Entity({
  discriminatorValue: 'mechanicalEquipment',
})
export default abstract class MechanicalEquipment extends Item {
  constructor(
    type: string,
    x: number,
    y: number,
    tag?: string,
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
  ) {
    super(type, x, y, tag, name, length, width, depth, diameter);
    this.emptyMass = emptyMass;
    this.head = head;
    this.filledMass = filledMass;
    this.netVolume = netVolume;
    this.grossVolume = grossVolume;
  }

  @Property({ nullable: true, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    emptyMass?: number;

  @Property({ nullable: true, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    head?: number;

  @Property({ nullable: true, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    filledMass?: number;

  @Property({ nullable: true, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    netVolume?: number;

  @Property({ nullable: true, type: 'float' })
  @ObjectProperty(PropertyType.NUMBER)
    grossVolume?: number;
}
