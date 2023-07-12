'use client';

import { useState } from 'react';
import { Icons } from './Icons';
import { signIn } from 'next-auth/react';

const GoogleLogIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onClickGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (e) {
      console.log(e);
      // TODO : PRINT ERROR
    }
  };

  return (
    <div
      onClick={onClickGoogleLogin}
      className='text-sm mx-auto flex justify-center items-center space-x-2 py-2 px-4 border-[1px] rounded-lg cursor-pointer hover:border-main'
    >
      <Icons.google className='w-4 h-4' />
      <span>
        {isLoading ? '로딩중' : 'Google 계정으로 로그인'}
      </span>
    </div>
  );
};

export default GoogleLogIn;
