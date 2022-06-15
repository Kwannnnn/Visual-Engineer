import classNames from 'classnames';
import React from 'react';
import ButtonRole from './ButtonRole.enum';

interface ButtonProps {
  label: string;
  role: ButtonRole;
  onClick: () => void;
}

function Button(props: ButtonProps) {
  const { label, role, onClick } = props;
  return (
    <button
      className={classNames('font-medium font-sm py-2 px-4 rounded-md focus:outline-none focus:shadow-outline', {
        'bg-blue-500 hover:bg-blue-700 text-white': role === ButtonRole.Primary,
        'bg-white hover:bg-gray-100 text-gray-700 border': role === ButtonRole.Secondary,
        'bg-red-500 hover:bg-red-700 text-white border': role === ButtonRole.Destructive,
      })}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Button;
