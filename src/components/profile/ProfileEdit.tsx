'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';

const ProfileEdit = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div>
      <div className='mx-auto max-w-screen-7xl'>
        <div className='md:grid md:grid-cols-3 md:gap-4'>
          <div className='md:col-span-1 font-medium border-b'>
            계정 정보
          </div>
          <div className='bg-slate-100 md:col-span-2 rounded-md py-8 px-4'>
            <div className='flex flex-col'>
              <div className='flex items-center justify-center flex-col mb-4'>
                {session?.user?.image ? (
                  <div className='relative aspect-square w-20 h-20 md:w-32 md:h-32 rounded-full'>
                    <Image
                      fill
                      src={session.user.image!}
                      alt='user avatar'
                      referrerPolicy='no-referrer'
                      className='rounded-full'
                    />
                  </div>
                ) : (
                  <div className='w-20 h-20 md:w-32 md:h-32 rounded-full'>
                    <Icons.user className='border-[2px] p-1 rounded-full border-slate-900' />
                  </div>
                )}
                <button className='w-fit bg-main text-white p-2 mt-4 rounded-md text-sm hover:bg-mainDark'>
                  사진 변경
                </button>
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-5 text-gray-700'
                >
                  이메일
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  className='block flex-1 w-full bg-transparent border-b py-2 px-4 mt-1 outline-none focus:border-main'
                  defaultValue={session?.user?.email!}
                  disabled={true}
                />
                {session?.user.provider === 'GOOGLE' ? (
                  <div className='flex justify-end items-center w-full'>
                    <span className='w-fit text-main p-2 mt-2 rounded-md text-sm'>
                      google 계정으로 로그인
                    </span>
                  </div>
                ) : null}
                {session?.user?.emailVerified === null &&
                session?.user?.provider ===
                  'CREDENTIALS' ? (
                  <div className='flex justify-end items-center w-full'>
                    <button className='w-fit bg-main text-white p-2 mt-2 rounded-md text-sm hover:bg-mainDark'>
                      인증하기
                    </button>
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor='username'
                  className='block text-sm font-medium leading-5 text-gray-700'
                >
                  닉네임
                </label>
                <input
                  type='username'
                  id='username'
                  className='block flex-1 w-full bg-transparent border-b py-2 px-4 mt-1 outline-none focus:border-main'
                  defaultValue={session?.user?.username!}
                />
                <div className='flex justify-end items-center w-full'>
                  <button className='w-fit bg-main text-white p-2 mt-2 rounded-md text-sm hover:bg-mainDark'>
                    변경하기
                  </button>
                </div>
              </div>
            </div>
          </div>
          {session?.user?.provider === 'CREDENTIALS' ? (
            <>
              <div className='md:col-span-1 font-medium border-b'>
                비밀번호 변경
              </div>
              <div className='bg-slate-100 md:col-span-2 rounded-md py-8 px-4'>
                비밀번호 변경
              </div>
            </>
          ) : null}
          <div className='md:col-span-1 font-medium border-b'>
            회원 탈퇴
          </div>
          <div className='bg-slate-100 md:col-span-2 rounded-md py-8 px-4'>
            회원탈퇴
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
