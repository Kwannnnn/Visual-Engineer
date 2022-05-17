import React from 'react';

interface BuilderData {
    data: React.ReactNode;
    divStyle: string;
}

class ReactNodeBuilder {
  private readonly node: BuilderData;

  constructor(tailwindClasses?: string) {
    this.node = {
      data: '',
      divStyle: tailwindClasses ?? '',
    };
  }

  append(item: React.ReactNode): ReactNodeBuilder {
    if (item && item !== null) this.node.data = (<>{this.node.data}{item}</>);
    return this;
  }

  build(): React.ReactNode {
    return (
      <div className={this.node.divStyle}>{this.node.data}</div>
    );
  }
}

export default ReactNodeBuilder;
