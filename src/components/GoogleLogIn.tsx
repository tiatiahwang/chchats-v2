'use client';

import { useState } from 'react';
import { Icons } from './Icons';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

const GoogleLogIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onClickGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (e) {
      return toast.error(
        '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
        {
          className: 'text-sm whitespace-pre-line',
        },
      );
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={onClickGoogleLogin}
      className={`w-full text-sm mx-auto flex justify-center items-center space-x-2 py-2 px-4 border-[1px] rounded-lg ${
        isLoading
          ? 'bg-gray-300'
          : 'bg-transparent cursor-pointer hover:border-main '
      }`}
    >
      <Icons.google className='w-4 h-4' />
      <span className={`${isLoading ? 'text-white' : ''}`}>
        {isLoading ? '로딩중' : 'Google 계정으로 로그인'}
      </span>
    </button>
  );
};

export default GoogleLogIn;
