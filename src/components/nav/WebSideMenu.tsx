'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const WebSideMenu = () => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <>
      {/* search input */}
      <div className=''>서치인풋</div>
      {/* 프로필 */}
      <div className='cursor-pointer'>
        {session?.user ? (
          session?.user?.image ? (
            <div
              onClick={() => router.push('/profile')}
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
              onClick={() => router.push('/profile')}
              className='w-8 h-8 border-[1.5px] p-1 rounded-full border-slate-900 md:w-10 md:h-10'
            />
          )
        ) : (
          <div className='space-x-4'>
            <Link
              href='/login'
              className='py-2 px-4 rounded-2xl bg-transparent border border-main text-sm hover:bg-main hover:text-white'
            >
              로그인
            </Link>
            <Link
              href='/join'
              className='py-2 px-4 rounded-2xl bg-main text-white border border-main text-sm hover:bg-mainDark hover:border-mainDark'
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default WebSideMenu;
