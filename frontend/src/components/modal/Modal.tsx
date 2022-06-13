import { faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import Button from '../button/Button';
import ButtonRole from '../button/ButtonRole.enum';
import ModalType from './ModalType.enum';

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  modalType?: ModalType;
  title: string;
  description: string;
  buttonText: string;
  className?: string;
  onButtonClick?: () => void;
}

function Modal(props: ModalProps) {
  const {
    showModal, className = '',
    title, description, modalType = ModalType.Normal,
    buttonText,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onButtonClick = () => {}, closeModal,
  } = props;

  const onClickHandler = () => {
    onButtonClick();
    closeModal();
  };

  const buttons = () => {
    switch (modalType) {
      case ModalType.Normal:
        return (
          <Button onClick={onClickHandler} role={ButtonRole.Primary} label={buttonText} />
        );
      case ModalType.Destructive:
        return (
          <>
            <Button onClick={closeModal} role={ButtonRole.Secondary} label="Cancel" />
            <Button onClick={onClickHandler} role={ButtonRole.Destructive} label={buttonText} />
          </>
        );
      default:
        return (
          <Button onClick={onClickHandler} role={ButtonRole.Primary} label={buttonText} />
        );
    }
  };

  return (
    <div className={classNames(`flex justify-center items-center ${className}`, {
      hidden: !showModal,
      block: showModal,
    })}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all border sm:max-w-md">
        <div className="flex items-start space-x-4 px-6 py-5">
          {modalType === ModalType.Destructive && (
            <div className="flex justify-center items-center p-3 rounded-full bg-red-100">
              <FontAwesomeIcon icon={faTriangleExclamation} size="lg" className="text-red-500" />
            </div>
          )}
          {modalType === ModalType.Info && (
            <div className="flex justify-center items-center p-3 rounded-full bg-blue-100">
              <FontAwesomeIcon icon={faCircleInfo} size="lg" className="text-blue-500" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-500 mt-1.5">{description}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-2 bg-gray-50 px-6 py-2">
          {buttons()}
        </div>
      </div>
    </div>
  );
}

export default Modal;
