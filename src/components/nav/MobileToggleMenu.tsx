'use client';

import { useState } from 'react';
import { Icons } from '../Icons';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const MobileToggleMenu = () => {
  const { data: session } = useSession();
  const [iconClicked, setIconClicked] = useState(false);
  const onIconClick = () => setIconClicked(!iconClicked);
  return (
    <>
      <div
        className='cursor-pointer text-main'
        onClick={onIconClick}
      >
        {iconClicked ? (
          <Icons.close className='h-6 w-6' />
        ) : (
          <Icons.hamburger className='h-6 w-6' />
        )}
      </div>
      {iconClicked && (
        <div className='top-[56px] left-0 absolute z-10 w-full shadow-md bg-slate-50'>
          <div className='border-b px-4 py-6 space-x-4 text-sm'>
            {session?.user ? (
              <div className='flex items-center justify-between'>
                <div className='flex space-x-2 items-center'>
                  <div className='cursor-pointer'>
                    {session.user.image ? (
                      <div className='relative aspect-square h-8 w-8 rounded-full md:w-10 md:h-10'>
                        <Image
                          fill
                          src={session?.user.image!}
                          alt='user avatar'
                          referrerPolicy='no-referrer'
                          className='rounded-full'
                        />
                      </div>
                    ) : (
                      <Icons.user className='w-8 h-8 border-[1.5px] p-1 rounded-full border-slate-900 md:w-10 md:h-10' />
                    )}
                  </div>
                  <div>
                    <div className='font-semibold'>
                      {session.user.username}
                    </div>
                    <div className='text-gray-500 text-xs'>
                      {session.user.email}
                    </div>
                  </div>
                </div>
                <div className='space-x-2'>
                  <Link
                    href='/profile'
                    className='p-2 rounded-md bg-main text-white hover:bg-mainDark'
                    onClick={() =>
                      setIconClicked(!iconClicked)
                    }
                  >
                    내 계정
                  </Link>
                  <button
                    className='p-2 rounded-md bg-main text-white hover:bg-mainDark'
                    onClick={() =>
                      signOut({
                        callbackUrl: '/',
                      })
                    }
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href='/login'
                  onClick={onIconClick}
                  className='py-2 px-4 rounded-2xl bg-main text-white hover:bg-mainDark'
                >
                  로그인
                </Link>
                <Link
                  href='/join'
                  onClick={onIconClick}
                  className='py-2 px-4 rounded-2xl bg-main text-white hover:bg-mainDark'
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
          <div
            className={`px-2 my-2 ${
              iconClicked ? '' : 'hidden'
            }`}
          >
            <Link href='/board' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                자유게시판
              </p>
            </Link>
            <Link href='/qna' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                묻고답하기
              </p>
            </Link>
            <Link href='/market' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                온라인마켓
              </p>
            </Link>
            <Link href='/region' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                지역소모임
              </p>
            </Link>
            <Link href='/notice' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                공지사항
              </p>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileToggleMenu;
