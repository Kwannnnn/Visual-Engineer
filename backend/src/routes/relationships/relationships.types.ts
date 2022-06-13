import Item from '../../database/models/Item';

export interface RelationshipParams {
  pipelineTag: string;
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
