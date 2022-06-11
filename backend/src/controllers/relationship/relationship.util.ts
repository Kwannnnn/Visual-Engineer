import { getClass } from '../board/board.util';
import ValidationError from '../../error/ValidationError';
import { Item } from '../../database/models';

const possibleRelationships = {
  0: ['PipeItem', 'RotatingEquipment'],
  1: ['PipeItem', 'StaticEquipment'],
};

function getClassName(type: string): string {
  const itemClassName = getClass(type).prototype.constructor.name;
  return itemClassName;
}

function getSuperClassName(item: Item): string {
  const itemPrototype = getClass(item.type).prototype;
  const itemSuperClassName = Object.getPrototypeOf(itemPrototype).constructor.name;

  return itemSuperClassName;
}

function getRelationshipTuple(firstItem: Item, secondItem: Item): string[] {
  const firstItemSuperClass = getSuperClassName(firstItem);
  const secondItemSuperClass = getSuperClassName(secondItem);

  return [firstItemSuperClass, secondItemSuperClass];
}

export default function checkItemsRelationship(firstItem: any, secondItem: any): void {
  const firstItemClassName = getClassName(firstItem.type);
  const secondItemClassName = getClassName(secondItem.type);

  const relationship = getRelationshipTuple(firstItem, secondItem);

  const isRelationshipPossible = Object
    .values(possibleRelationships)
    .some((a) => a.every((e) => relationship.includes(e)));

  if (!isRelationshipPossible) {
    throw new ValidationError(`You cannot associate a ${firstItemClassName} with a ${secondItemClassName}!`, 400);
  }
}
