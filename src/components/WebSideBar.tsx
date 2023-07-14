'use client';

import { useState } from 'react';
import { Icons } from '@/components/Icons';
import { useRouter } from 'next/navigation';

const WebSideBar = () => {
  const router = useRouter();
  // TODO: 로직 하나로 합치기
  const [firstHover, setFirstHover] = useState(false);
  const [secondHover, setSecondHover] = useState(false);
  const [thirdHover, setThirdHover] = useState(false);
  const [fourthHover, setFourthHover] = useState(false);
  const onHover = (index: number) => {
    if (index === 1) setFirstHover(true);
    else if (index === 2) setSecondHover(true);
    else if (index === 3) setThirdHover(true);
    else setFourthHover(true);
  };
  const onLeave = (index: number) => {
    if (index === 1) setFirstHover(false);
    else if (index === 2) setSecondHover(false);
    else if (index === 3) setThirdHover(false);
    else setFourthHover(false);
  };
  return (
    <div className='hidden md:flex md:flex-col cursor-pointer shrink-0'>
      <div className='sticky top-16 space-y-2'>
        <div className='flex flex-col w-[150px] rounded-lg h-fit border'>
          <div
            className='rounded-t-lg font-bold bg-main text-white py-2 px-4 hover:bg-mainDark'
            onMouseEnter={() => onHover(1)}
            onMouseLeave={() => onLeave(1)}
            role='button'
          >
            {firstHover ? (
              <div
                className='flex justify-between items-center relative'
                onClick={() => router.push('/board')}
              >
                <span>자유게시판</span>
                <Icons.chevRight className='h-4 w-4 absolute -right-2' />
              </div>
            ) : (
              <span>자유게시판</span>
            )}
          </div>
          <div>
            <div className='px-4 hover:bg-mainLight py-2'>
              사는얘기
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              고민상담
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              정보공유
            </div>
          </div>
        </div>
        <div className='flex flex-col w-[150px] rounded-lg h-fit border'>
          <div
            className='rounded-t-lg font-bold bg-main text-white py-2 px-4 hover:bg-mainDark'
            onMouseEnter={() => onHover(2)}
            onMouseLeave={() => onLeave(2)}
            role='button'
          >
            {secondHover ? (
              <div className='flex justify-between items-center relative'>
                <span>묻고답하기</span>
                <Icons.chevRight className='h-4 w-4 absolute -right-2' />
              </div>
            ) : (
              <span>묻고답하기</span>
            )}
          </div>
          <div>
            <div className='px-4 hover:bg-mainLight py-2'>
              비자
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              법률
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              건강
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              교육
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              육아
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              취업
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              부동산
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              기타
            </div>
          </div>
        </div>
        <div className='flex flex-col w-[150px] rounded-lg h-fit border'>
          <div
            className='rounded-t-lg font-bold bg-main text-white py-2 px-4 hover:bg-mainDark'
            onMouseEnter={() => onHover(3)}
            onMouseLeave={() => onLeave(3)}
            role='button'
          >
            {thirdHover ? (
              <div className='flex justify-between items-center relative'>
                <span>온라인마켓</span>
                <Icons.chevRight className='h-4 w-4 absolute -right-2' />
              </div>
            ) : (
              <span>온라인마켓</span>
            )}
          </div>
          <div>
            <div className='px-4 hover:bg-mainLight py-2'>
              팔아요
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              살게요
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              나눔
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              렌트
            </div>
          </div>
        </div>
        <div className='flex flex-col w-[150px] rounded-lg h-fit border'>
          <div
            className='rounded-t-lg font-bold bg-main text-white py-2 px-4 hover:bg-mainDark'
            onMouseEnter={() => onHover(4)}
            onMouseLeave={() => onLeave(4)}
            role='button'
          >
            {fourthHover ? (
              <div className='flex justify-between items-center relative'>
                <span>지역소모임</span>
                <Icons.chevRight className='h-4 w-4 absolute -right-2' />
              </div>
            ) : (
              <span>지역소모임</span>
            )}
          </div>
          <div>
            <div className='px-4 hover:bg-mainLight py-2'>
              산호세
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              샌프란
            </div>
            <div className='px-4 hover:bg-mainLight py-2'>
              LA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSideBar;
