import Item from '../../database/models/Item';

export interface RelationshipParams {
  pipelineId: number;
}

export interface RelationshipBody {
  pipeline: number;
  firstItem: number;
  secondItem: number;
}

export interface RelationshipRequestBody {
  pipeline: Item;
  firstItem: Item;
  secondItem: Item;
}
