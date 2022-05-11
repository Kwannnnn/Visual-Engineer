import React from 'react';
import { DBItemProp } from '../typings/props';

function DBItemContainer(props: DBItemProp) {
  const { className, properties } = props;

  return (
    <>
      {
        properties.map((p) => (
          <div key={p.key} className={className ?? 'border-2 border-blue-200 rounded-lg p-2 m-2 text-left'}>
            {
              Object.keys(p).map((i, index) => (
                <div className="my-3">
                  <span className="bg-blue-900 rounded-md p-2">
                    {Object.keys(p)[index]}
                  </span>
                  <span className="ml-2">
                    {p[Object.keys(p)[index]].toString()}
                  </span>
                </div>
              ))
            }
          </div>
        ))
      }
    </>
  );
}

export default DBItemContainer;
