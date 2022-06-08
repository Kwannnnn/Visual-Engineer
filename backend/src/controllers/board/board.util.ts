import {
  Pipeline, Blower, PipeFitting, Pump, Tank, Vessel,
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

export function checkRequiredAttributes(body: any): void {
  const itemClass = getClass(body.type);
  const requiredAttributes = ['type', 'x', 'y'];
  const properties = Object
    .getOwnPropertyNames(itemClass.prototype)
    .filter((p) => !propsToFilter.includes(p));

  Object.keys(body).forEach((key) => {
    if (!properties.includes(key)) {
      throw new ValidationError(`Field ${key} not supported for type ${body.type}`, 400);
    }
  });

  requiredAttributes.forEach((a) => {
    if (!body[a]) {
      throw new ValidationError(`Attribute ${a} is required`, 400);
    }
  });
}
