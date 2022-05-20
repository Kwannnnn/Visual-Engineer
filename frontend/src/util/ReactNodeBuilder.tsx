import React from 'react';

interface BuilderData {
    data?: React.ReactNode;
}

class ReactNodeBuilder {
  private readonly node: BuilderData;

  constructor() {
    this.node = {};
  }

  append(item: React.ReactNode): ReactNodeBuilder {
    if (item && item !== null) this.node.data = (<>{this.node.data}{item}</>);
    return this;
  }

  build(): React.ReactNode {
    let result;

    if (this.node.data) {
      result = (this.node.data);
    } else result = '';
    this.node.data = undefined;
    return result;
  }
}

export default ReactNodeBuilder;
