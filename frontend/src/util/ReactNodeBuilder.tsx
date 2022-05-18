import React from 'react';

interface BuilderData {
    data?: React.ReactNode;
    divStyle?: string;
    id?: string;
}

class ReactNodeBuilder {
  private readonly node: BuilderData;

  constructor(tailwindClasses?: string, id?: string) {
    this.node = {
      divStyle: tailwindClasses,
      id,
    };
  }

  append(item: React.ReactNode): ReactNodeBuilder {
    if (item && item !== null) this.node.data = (<>{this.node.data}{item}</>);
    return this;
  }

  build(): React.ReactNode {
    let result;

    if (this.node.data) {
      result = (
        <div className={this.node.divStyle} id={this.node.id}>{this.node.data}</div>
      );
    } else result = '';
    this.node.data = '';
    return result;
  }
}

export default ReactNodeBuilder;
