import React from 'react';
import { ContainerProp } from '../typings/props';

function Container(props: ContainerProp) {
  const { className, children, id } = props;
  const stl = className ?? 'border-2 border-sky-500 overflow-auto rounded-md p-2 m-2 w-96 max-h-96';
  return (
    <div id={id} className={stl}>
      {children ?? 'Empty Container'}
    </div>
  );
}

export default Container;
