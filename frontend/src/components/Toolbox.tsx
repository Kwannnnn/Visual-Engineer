import React from 'react';
import ToolboxList from './ToolboxList';

interface ReqProp {
  listing: Listing[];
  id?: string;
  className?: string;

}

interface Listing {
  group?: string,
  subsets?: Listing[],
  items?: Item[]
}

interface Item {
  name: string;
}

function Toolbox({ listing, id, className }: ReqProp) {
  return (
    <div className={`overflow-auto rounded-md w-full h-ful m-2 p-2 ${className}`} id={id}>
      <ToolboxList listing={listing} />
    </div>
  );
}

export default Toolbox;
