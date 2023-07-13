'use client';

import { useSession } from 'next-auth/react';
import { Icons } from '../Icons';
import Link from 'next/link';
import { cls } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

const ProfileNav = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {session?.user ? (
        <>
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
                <button
                  className='p-2 rounded-md bg-main text-white hover:bg-mainDark text-sm'
                  onClick={() => {
                    router.push('/profile/edit');
                  }}
                >
                  프로필 수정
                </button>
              </div>
            </div>
          ) : null}
          <div className='flex items-center justify-start gap-x-6 border-b-[1px] border-gray-100 text-sm mt-6 font-medium'>
            <Link href='/profile/mypost' className='pb-4'>
              <span
                className={cls(
                  'pb-4 px-2',
                  pathname.includes('mypost') ||
                    pathname.split('/').length === 2
                    ? 'border-b-[3px] border-main text-main'
                    : 'hover:border-b-[3px] hover:border-mainDark hover:text-mainDark',
                )}
              >
                내가 쓴 글
              </span>
            </Link>
            <Link
              href='/profile/mycomment'
              className='pb-4'
            >
              <span
                className={cls(
                  'pb-4 px-2',
                  pathname.includes('mycomment')
                    ? 'border-b-[3px] border-main text-main'
                    : 'hover:border-b-[3px] hover:border-mainDark hover:text-mainDark',
                )}
              >
                나의 댓글
              </span>
            </Link>
            <Link href='/profile/myscrap' className='pb-4'>
              <span
                className={cls(
                  'pb-4 px-2',
                  pathname.includes('myscrap')
                    ? 'border-b-[3px] border-main text-main'
                    : 'hover:border-b-[3px] hover:border-mainDark hover:text-mainDark',
                )}
              >
                스크랩
              </span>
            </Link>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ProfileNav;
