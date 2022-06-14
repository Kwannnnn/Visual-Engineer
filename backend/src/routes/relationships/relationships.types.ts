import Item from '../../database/models/Item';

export interface RelationshipParams {
  pipelineId: number;
}

export interface RelationshipBody {
  pipeline: string;
  firstItem: string;
  secondItem: string;
}

export interface RelationshipRequestBody {
  pipeline: Item;
  firstItem: Item;
  secondItem: Item;
}
