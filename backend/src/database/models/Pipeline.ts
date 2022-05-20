import { Entity, Property } from '@mikro-orm/core';
import PipeItem from './PipeItem';
import PressureClass from './PressureClass.enum';

@Entity({ discriminatorValue: 'pipeline' })
export default class Pipeline extends PipeItem {
  constructor(
    tag: string,
    name: string,
    length: number,
    width: number,
    depth: number,
    diameter: number,
    type: string,
    pressureClass: PressureClass,
    flange: string,
    lining: string,
    type: string,
  ) {
<<<<<<< HEAD
    super(tag, name, length, width, depth, diameter, pressureClass, type);
=======
    super(tag, name, length, width, depth, diameter, type, pressureClass);
>>>>>>> 4760a9cbb83e5e1f250f2e8bc395a9a00a5d42b1
    this.flange = flange;
    this.lining = lining;
  }

  @Property({ nullable: true })
    flange!: string;

  @Property({ nullable: true })
    lining!: string;
}
