import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

export interface ModalProps {
  text: string;
  open: boolean;
  onClose: () => void;
  buttonText: string;
  handleButton: any;
  className: string;
}

const Modal = ({
  text,
  open,
  onClose,
  buttonText,
  handleButton,
  className,
}: ModalProps) => {
  if (!open) return null;

  return createPortal(
    <Fragment>
      <div className='fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black/40'>
        <div className='bg-white min-w-[300px] p-8 flex flex-col items-center rounded-md space-y-8'>
          <div className='fon-medium'>{text}</div>
          <div className='space-x-4'>
            <Button
              type='transparent'
              width='w-fit'
              text='취소'
              className='border-none rounded-md hover:bg-gray-400 px-4'
              onClick={onClose}
            />
            <Button
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
