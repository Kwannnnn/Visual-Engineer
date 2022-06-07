import { Loaded } from '@mikro-orm/core';
import ValidationError from '../../error/ValidationError';
import { RelationshipBody, RelationshipParams } from '../../routes/relationships/relationships.types';
import { Relationship, Item, Pipeline } from '../../database/models';
import { TypedRequest } from '../../routes/util/typed-request';

export function validateRelationshipPatchBody(
  req: TypedRequest<RelationshipParams, RelationshipBody>,
  relationship: Loaded<Relationship, never> | null,
  pipelineTag: string,
): void {
  if (!relationship) { throw new ValidationError('Relationship not found', 400); }
  if (!req.body || (!req.body.firstItem && !req.body.secondItem && !req.body.pipeline)) { throw new ValidationError('Mandatory fields in request body are missing', 400); }
  if (!req.body.pipeline || pipelineTag !== req.body.pipeline) { throw new ValidationError('Pipeline tag in request body does not match', 400); }
  if (req.body.firstItem === req.body.secondItem) { throw new ValidationError('First and second item cannot be the same', 400); }
}

export function validateRelationshipItems(
  req: TypedRequest<RelationshipParams, RelationshipBody>,
  firstItem: Loaded<Item, never> | null,
  secondItem: Loaded<Item, never> | null,
  pipeline: Loaded<Item, never> | null,

): void {
  if (secondItem instanceof Pipeline || firstItem instanceof Pipeline) { throw new ValidationError('Connected item cannot be a pipe item', 400); }
  if (!pipeline) { throw new ValidationError('Pipeline not found', 400); }
  if ((req.body!.firstItem && !firstItem) || (req.body!.secondItem && !secondItem)) { throw new ValidationError('Item by tag not found', 404); }
}
