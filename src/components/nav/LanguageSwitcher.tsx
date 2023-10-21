'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const redirectedPathname = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className='relative text-xs'>
      <button
        type='button'
        className='border focus:ring-1 focus:outline-none hover:border-main focus:ring-main rounded-md px-3 py-2 text-center inline-flex items-center'
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {pathname.includes('ko') ? '언어선택' : 'language'}
        <svg
          className='w-2.5 h-2.5 ml-2.5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 10 6'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1'
            d='m1 1 4 4 4-4'
          />
        </svg>
      </button>
      {showDropdown && (
        <div className='z-50 absolute top-10 bg-white rounded-lg w-full'>
          <ul className='py-2'>
            <li className='block px-4 py-2 hover:bg-gray-100 cursor-pointer'>
              <Link href={redirectedPathname('en')}>
                {pathname.includes('ko')
                  ? '영어'
                  : 'English'}
              </Link>
            </li>
            <li className='block px-4 py-2 hover:bg-gray-100 cursor-pointer'>
              <Link href={redirectedPathname('ko')}>
                {pathname.includes('ko')
                  ? '한국어'
                  : 'Korean'}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
