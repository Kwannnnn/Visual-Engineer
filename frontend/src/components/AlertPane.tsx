import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface AlertPaneProps {
  className?: string;
  message: string;
}

function AlertPane(props: AlertPaneProps) {
  const { className = '', message } = props;
  return (
    <div className={`p-3 ${className}`}>
      <div className="bg-amber-100 rounded-md text-gray-900 px-4 py-3 shadow-lg border-l-4 border-amber-500" role="alert">
        <div className="flex items-center">
          <div className="py-1"><svg className="fill-current h-6 w-6 text-amber-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg></div>
          <div className="flex-1">
            <p className="font-bold">Something went wrong</p>
            <p className="text-sm">{message}</p>
          </div>
          <button
            data-cy="close-sidebar-btn"
            className="text-amber-700 hover:bg-amber-200 text-sm px-2 py-0.5 rounded-full cursor-pointer"
            type="button"
          >
            <FontAwesomeIcon icon={faX} size="xs" />
          </button>
        </div>
      </div>
    </div>

  );
}

export default AlertPane;
