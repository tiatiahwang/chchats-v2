import { useState } from 'react';
import { Icons } from './Icons';
import Link from 'next/link';

const MobileSideMenu = () => {
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
            <Link
              href='/'
              className='py-2 px-4 rounded-2xl bg-main text-white hover:bg-mainDark'
            >
              로그인
            </Link>
            <Link
              href='/'
              className='py-2 px-4 rounded-2xl bg-main text-white hover:bg-mainDark'
            >
              회원가입
            </Link>
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
            <Link href='/notice'>
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

export default MobileSideMenu;
