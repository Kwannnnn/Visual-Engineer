import { Item } from '../../database/models';
import { getClass } from '../board/board.util';
import ValidationError from '../../error/ValidationError';

const possibleRelationships = {
  0: ['PipeItem', 'RotatingEquipment'],
  1: ['PipeItem', 'StaticEquipment'],
};

export function validateRequest(body: any): void {
  if (!body.pipeline) {
    throw new ValidationError('Pipeline tag is missing.', 400);
  }

  if (!body.firstItem || !body.secondItem) {
    throw new ValidationError('Two items are needed to create a relationship.', 400);
  }
}

export function validateItems(pipeline: any, firstItem: any, secondItem: any): void {
  if (!pipeline || !firstItem || !secondItem) {
    throw new ValidationError('Item not found', 404);
  }

  if (pipeline.type !== 'pipeline') {
    throw new ValidationError('The connector must be of type Pipeline.', 400);
  }
}

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

export function checkItemsRelationship(firstItem: any, secondItem: any): void {
  const firstItemClassName = getClassName(firstItem.type);
  const secondItemClassName = getClassName(secondItem.type);

  const relationship = getRelationshipTuple(firstItem, secondItem);

  // eslint-disable-next-line max-len
  const isRelationshipPossible = Object.values(possibleRelationships).some((a) => a.every((e) => relationship.includes(e)));

  if (!isRelationshipPossible) {
    throw new ValidationError(`You cannot associate a ${firstItemClassName} with a ${secondItemClassName}!`, 400);
  }
}
