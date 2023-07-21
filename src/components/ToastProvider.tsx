'use client';

import { Slide, ToastContainer } from 'react-toastify';

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({
  children,
}: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        transition={Slide}
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        progressStyle={undefined}
      />
    </>
  );
}
