import React from 'react';
import { ButtonProp } from '../typings/props';

function Button(props: ButtonProp) {
  const {
    className, onClick, children, id,
  } = props;
  return (
    <button id={id} type="button" className={className ?? 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'} onClick={onClick} aria-label="click"> {children ?? 'Button'} </button>
  );
}

export default Button;
