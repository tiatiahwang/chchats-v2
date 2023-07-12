'use client';

import Link from 'next/link';
import MobileSideMenu from './MobileSideMenu';
import Avatar from './Avatar';
import { useSession } from 'next-auth/react';

const NavBar = () => {
  // const { data: session, status } = useSession();
  // console.log('session', session);
  return (
    <div className='fixed top-0 inset-x-0 h-14 border-b border-zinc-200 z-[10] p-2 bg-slate-50'>
      {/* 모바일 - 로고/햄버거아이콘 */}
      {/* 웹 - 로고/서칭인풋+프로필 */}
      <div className='max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* 로고 */}
        <div className='md:flex'>
          <Link href='/' className='cursor-pointer'>
            <img
              className='w-[100px]'
              src='/logo_light.png'
              alt='logo'
            />
          </Link>
        </div>
        {/* 모바일 - 우측 햄버거 아이콘 */}
        <div className='md:hidden'>
          <MobileSideMenu />
        </div>
        <div className='hidden md:flex md:items-center md:space-x-6'>
          {/* search input */}
          <div className=''>서치인풋</div>
          {/* 프로필 */}
          <Avatar className='md:w-10 md:h-10' user={''} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
