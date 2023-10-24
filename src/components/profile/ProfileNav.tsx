'use client';

import { Icons } from '../Icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { User } from 'next-auth';
import { Activities } from '@/types/dictionary';

interface ProfileNavProps {
  text: Activities;
  user: User & {
    username: string | null;
  };
}

const ProfileNav = ({ text, user }: ProfileNavProps) => {
  const pathname = usePathname();

  return (
    <>
      {user ? (
        <div className='flex items-center justify-between'>
          <div className='flex space-x-2 items-center'>
            <div className='cursor-pointer'>
              {user.image ? (
                <div className='relative aspect-square h-8 w-8 rounded-full md:w-10 md:h-10'>
                  <Image
                    fill
                    src={user.image!}
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
                {user?.username}
              </div>
              <div className='text-gray-500 text-xs'>
                {user?.email}
              </div>
            </div>
          </div>
          <div className='space-x-2'>
            <Link
              className='p-2 rounded-md bg-main text-white hover:bg-mainDark text-sm'
              href='/profile/edit'
            >
              {text.button}
            </Link>
          </div>
        </div>
      ) : null}
      {/* profile nav */}
      <div className='flex items-center justify-start gap-x-6 border-b text-sm my-6 font-medium'>
        <Link href='/profile' className='pb-4'>
          <span
            className={`${
              pathname.split('/').length === 3
                ? 'border-b-[3px] border-main text-main'
                : 'hover:border-b-[3px] hover:border-mainDark hover:text-mainDark'
            } pb-4 px-2`}
          >
            {text.myposts}
          </span>
        </Link>
        <Link href='/profile/mycomment' className='pb-4'>
          <span
            className={`${
              pathname.includes('mycomment')
                ? 'border-b-[3px] border-main text-main'
                : 'hover:border-b-[3px] hover:border-mainDark hover:text-mainDark'
            } pb-4 px-2`}
          >
            {text.mycomments}
          </span>
        </Link>
        <Link href='/profile/myscrap' className='pb-4'>
          <span
            className={`${
              pathname.includes('myscrap')
                ? 'border-b-[3px] border-main text-main'
                : 'hover:border-b-[3px] hover:border-mainDark hover:text-mainDark'
            } pb-4 px-2`}
          >
            {text.myscrap}
          </span>
        </Link>
      </div>
    </>
  );
};

export default ProfileNav;
