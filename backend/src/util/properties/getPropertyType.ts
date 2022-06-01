import { OBJECT_PROPERTY_KEY } from './ObjectProperty';
import Property from './Property';

/**
 * Utility function to fetch metadata from a class property
 * @param target Class instance
 * @param propertyName Class property name
 * @returns Property object (name, type)
 */
export default function getPropertyType(
  target: any,
  propertyName: string | symbol,
): Property | null {
  const propertyKey = Reflect.getMetadataKeys(target, propertyName)
    .find((key) => key.toString() === OBJECT_PROPERTY_KEY);

  const type = Reflect.getMetadata(propertyKey, target, propertyName);

  if (!type) {
    return null;
  }

  const property: Property = { name: propertyName.toString(), type };

  return property;
}
