'use client';

import { Icons } from '@/components/Icons';
import Link from 'next/link';

const Page = () => {
  return (
    <div className='border rounded-md w-full p-4'>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        자유게시판
      </h1>
      <button className='p-2 border rounded-md'>
        글 작성 버튼
      </button>
      <ul className='py-2 space-y-2'>
        <li>
          <div className='rounded-md bg-shite shadow'>
            <div className='px-6 py-4 flex justify-between'>
              <div className='w-0 flex-1'>
                <div className='max-h-40 mt-1 text-xs text-gray-500 '>
                  <a
                    className='text-[10px] bg-main p-1 rounded-sm text-white'
                    href='/'
                  >
                    고민상담
                  </a>
                  <span className='pl-2'>티아티아</span>
                  <span className='px-1'>•</span>
                  2일 전
                </div>
                <a href='/'>
                  <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
                    글 제목이 여기다
                  </h1>
                </a>
                <div className='relative text-sm max-h-40 w-full overflow-clip'>
                  안녕하세요 반가워요 고민이 있어요...
                </div>
              </div>
            </div>
            <div className='bg-gray-50 z-20 text-sm px-4 pb-4 sm:px-6'>
              <Link
                href='/'
                className='w-fit flex items-center gap-1'
              >
                <Icons.comment className='h-4 w-4' />0
              </Link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Page;
