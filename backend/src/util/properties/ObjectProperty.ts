import PropertyType from './PropertyType';

export const OBJECT_PROPERTY_KEY = 've:object:property';

/**
 * Object property type decorator
 * @param type Property type (NUMBER, STRING, etc)
 * @returns Decorator function to mark object property types
 */
export default function ObjectProperty(type: PropertyType) {
  return function ObjectPropertyDecorator(target: Object, propertyKey: string | symbol) {
    Reflect.defineMetadata(OBJECT_PROPERTY_KEY, type, target, propertyKey);
  };
}
