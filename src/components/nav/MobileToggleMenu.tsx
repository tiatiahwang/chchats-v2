'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { Icons } from '@/components/Icons';
import Button from '@/components/ui/Button';
import { MobileNav } from '@/types/dictionary';

interface MobileToggleMenuProps {
  lang: string;
  text: MobileNav;
}
const MobileToggleMenu = ({
  lang,
  text,
}: MobileToggleMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [iconClicked, setIconClicked] = useState(false);
  const onIconClick = () => setIconClicked(!iconClicked);

  const redirectedPathname = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const refreshPage = (locale: string) => {
    const url = redirectedPathname(locale);
    router.push(url);
  };
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
          {/* user info */}
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
                  {/* <Link
                    href='/profile'
                    className='p-2 rounded-md bg-main text-white hover:bg-mainDark'
                    onClick={() =>
                      setIconClicked(!iconClicked)
                    }
                  >
                    내 계정
                  </Link> */}
                  <Button
                    type='base'
                    text={text.profile.myaccount}
                    width='w-fit'
                    onClick={() => {
                      router.push('/profile');
                      setIconClicked(!iconClicked);
                    }}
                  />
                  <Button
                    type='base'
                    text={text.profile.logout}
                    width='w-fit'
                    onClick={() => {
                      signOut({
                        callbackUrl: '/',
                      });
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Link
                  href='/login'
                  onClick={onIconClick}
                  className='py-2 px-4 rounded-2xl bg-main text-white hover:bg-mainDark'
                >
                  {text.auth.login}
                </Link>
                <Link
                  href='/join'
                  onClick={onIconClick}
                  className='py-2 px-4 rounded-2xl bg-main text-white hover:bg-mainDark'
                >
                  {text.auth.join}
                </Link>
              </>
            )}
          </div>
          {/* language */}
          <div className='border-b px-4 py-6 space-x-4 text-sm flex items-center justify-between'>
            <div>
              {lang === 'en' ? 'Language' : '언어 선택'}
            </div>
            <div className='flex space-x-2 items-center'>
              <div
                onClick={() => refreshPage('en')}
                className={`rounded-md p-2 text-sm cursor-pointer ${
                  pathname.includes('en')
                    ? 'bg-main text-white hover:bg-mainDark'
                    : 'border border-main hover:bg-main hover:text-white'
                }`}
              >
                {lang === 'en' ? 'English' : '영어'}
              </div>
              <div
                onClick={() => refreshPage('ko')}
                className={`border-main rounded-md p-2 text-sm cursor-pointer ${
                  pathname.includes('ko')
                    ? 'bg-main text-white hover:bg-mainDark'
                    : 'border border-main hover:bg-main hover:text-white'
                }`}
              >
                {lang === 'en' ? 'Korean' : '한국어'}
              </div>
            </div>
          </div>
          {/* categories */}
          <div
            className={`px-2 my-2 ${
              iconClicked ? '' : 'hidden'
            }`}
          >
            <Link href='/board' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                {text.category.board}
              </p>
            </Link>
            <Link href='/qna' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                {text.category.qna}
              </p>
            </Link>
            <Link href='/market' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                {text.category.market}
              </p>
            </Link>
            <Link href='/region' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                {text.category.region}
              </p>
            </Link>
            <Link href='/notice/all' onClick={onIconClick}>
              <p className='px-2 leading-10 font-semibold hover:text-white hover:bg-main hover:rounded-md'>
                {text.category.notice}
              </p>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileToggleMenu;
