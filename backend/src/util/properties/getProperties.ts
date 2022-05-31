import getPropertyType from './getPropertyType';
import Property from './Property';

/**
 * Get the list of object properties for a particular type of object
 * @param target Class instance
 * @returns Array of properties
 */
const getProperties = (target: any): Property[] => {
  const objectPropertyNames = Object.getOwnPropertyNames(target.prototype);

  const properties: Property[] = [];

  objectPropertyNames.forEach((propertyName) => {
    const property = getPropertyType(target.prototype, propertyName);

    if (property) {
      properties.push(property);
    }
  });

  return properties;
};

export default getProperties;
