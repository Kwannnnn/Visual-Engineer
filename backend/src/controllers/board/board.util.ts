import {
  Item, Pipeline, Blower, PipeFitting, Pump, Tank, Vessel,
} from '../../database/models';
import ValidationError from '../../error/ValidationError';

const propsToFilter = ['constructor', '__entity', '__meta', '__platform', '__factory', '__helper', 'toJSON'];

export function getClass(type: string): any {
  switch (type) {
    case 'blower': return Blower;
    case 'pipeFitting': return PipeFitting;
    case 'pipeline': return Pipeline;
    case 'pump': return Pump;
    case 'tank': return Tank;
    case 'vessel': return Vessel;
    default: throw new ValidationError('Unknown Item type', 400);
  }
}

export function checkTypeSpecificAttributes(body: any): void {
  const itemClass = getClass(body.type);
  const properties = Object
    .getOwnPropertyNames(itemClass.prototype)
    .filter((p) => !propsToFilter.includes(p));

  properties.push('tag');

  Object.keys(body).forEach((key) => {
    if (!properties.includes(key)) {
      throw new ValidationError(`Field ${key} not supported for type ${body.type}`, 400);
    }
  });

  properties.forEach((p) => {
    if (!Object.keys(body).includes(p) && p !== 'board') {
      throw new ValidationError(`Missing field ${p}`, 400);
    }
  });
}

export function checkCommonItemAttributes(body: any): void {
  const properties: string[] = Object
    .getOwnPropertyNames(Item.prototype)
    .filter((p) => !propsToFilter.includes(p));

  properties.push('tag');

  properties.forEach((p) => {
    if (!Object.keys(body).includes(p) && p !== 'board') {
      throw new ValidationError(`Missing field ${p}`, 400);
    }
  });
}
