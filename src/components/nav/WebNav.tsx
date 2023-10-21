'use client';

import Image from 'next/image';
import { Icons } from '../Icons';
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

const WebNav = ({ session, text }: any) => {
  const [avatarClicked, setAvatarClicked] = useState(false);
  const onClickAvatar = () =>
    setAvatarClicked(!avatarClicked);
  return (
    <div className='cursor-pointer relative'>
      {session?.user ? (
        session?.user?.image ? (
          <div
            onClick={onClickAvatar}
            className='relative aspect-square h-8 w-8 rounded-full md:w-10 md:h-10'
          >
            <Image
              fill
              src={session.user.image!}
              alt='user avatar'
              referrerPolicy='no-referrer'
              className='rounded-full'
            />
          </div>
        ) : (
          <Icons.user
            onClick={onClickAvatar}
            className='w-8 h-8 border-[1.5px] p-1 rounded-full border-slate-900 md:w-10 md:h-10'
          />
        )
      ) : (
        <div className='space-x-4'>
          <Link
            href='/login'
            className='py-2 px-4 rounded-2xl bg-transparent border border-main text-sm hover:bg-main hover:text-white'
          >
            {text.login}
          </Link>
          <Link
            href='/join'
            className='py-2 px-4 rounded-2xl bg-main text-white border border-main text-sm hover:bg-mainDark hover:border-mainDark'
          >
            {text.join}
          </Link>
        </div>
      )}
      {avatarClicked && (
        <div className='top-[44px] border origin-top-right right-0 w-44 absolute z-10 shadow-md bg-slate-50'>
          <div
            className={`text-sm ${
              avatarClicked ? '' : 'hidden'
            }`}
          >
            <Link
              href='/profile/edit'
              onClick={onClickAvatar}
            >
              <div className='leading-10 hover:text-main hover:rounded-md border-b-[1px]'>
                <p className='px-4'>프로필 수정</p>
              </div>
            </Link>
            <Link href='/profile' onClick={onClickAvatar}>
              <div className='leading-10 hover:text-main hover:rounded-md border-b-[1px]'>
                <p className='px-4'>활동 내역</p>
              </div>
            </Link>
            <div
              className='leading-10 hover:text-main hover:rounded-md'
              onClick={() =>
                signOut({
                  callbackUrl: '/',
                })
              }
            >
              <p className='px-4'>로그아웃</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebNav;
