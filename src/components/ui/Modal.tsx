import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

export interface ModalProps {
  lang?: string;
  text: string;
  open: boolean;
  onClose: () => void;
  buttonText: string;
  handleButton: any;
  className: string;
  isLoading: boolean;
}

const Modal = ({
  lang = '',
  text,
  open,
  onClose,
  buttonText,
  handleButton,
  className,
  isLoading,
}: ModalProps) => {
  if (!open) return null;
  return createPortal(
    <Fragment>
      <div
        className='fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black/40'
        onClick={(event) => {
          event.stopPropagation();
          if (
            event?.currentTarget !== event.target ||
            isLoading
          )
            return;
          if (typeof onClose === 'function') {
            onClose();
          }
        }}
      >
        <div className='bg-white min-w-[300px] p-8 flex flex-col items-center rounded-md space-y-8'>
          <div className='font-medium'>{text}</div>
          <div className='space-x-4'>
            <Button
              type='transparent'
              width='w-fit'
              text={lang === 'en' ? 'Cancel' : '취소'}
              className='border-none rounded-md hover:bg-gray-400 px-4'
              onClick={onClose}
            />
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              type='base'
              width='w-fit'
              text={buttonText}
              className={className}
              onClick={handleButton}
            />
          </div>
        </div>
      </div>
    </Fragment>,
    document.body as HTMLElement,
  );
};

export default Modal;
