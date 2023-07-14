'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';

const ProfileEdit = () => {
  const { data: session } = useSession();

  return (
    <div className='mx-auto max-w-screen-7xl'>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium border-b-[1px] pb-4'>
          계정 정보
        </div>
        <div className='bg-slate-100 md:col-span-2 rounded-md p-8'>
          <div className='flex flex-col'>
            {/* 아바타 변경 */}
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
            {/* 이메일 인증 */}
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
              {/* 구글 로그인한 유저에게만 보이는 문구 */}
              {session?.user.provider === 'GOOGLE' ? (
                <div className='flex justify-end items-center w-full'>
                  <span className='w-fit text-main p-2 mt-2 rounded-md text-sm'>
                    google 계정으로 로그인
                  </span>
                </div>
              ) : null}
              {/* 일반 로그인 한 경우 이메일 인증 버튼 출력 */}
              {session?.user?.emailVerified === null &&
              session?.user?.provider === 'CREDENTIALS' ? (
                <div className='flex justify-end items-center w-full'>
                  <button className='w-fit bg-main text-white p-2 mt-2 rounded-md text-sm hover:bg-mainDark'>
                    이메일 인증
                  </button>
                </div>
              ) : null}
            </div>
            {/* 닉네임 변경 */}
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
                  닉네임 변경
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 일반 로그인 한 경우, 비밀번호 변경 내용 출력 */}
        {session?.user?.provider === 'CREDENTIALS' ? (
          <>
            <div className='md:col-span-1 font-medium border-b-[1px] py-4 md:py-0'>
              비밀번호 변경
            </div>
            <div className='bg-slate-100 md:col-span-2 rounded-md p-8'>
              <form>
                <div className='space-y-4'>
                  <div>
                    <label
                      htmlFor='current-password'
                      className='block text-sm font-medium leading-5 text-gray-700'
                    >
                      현재 비밀번호
                    </label>
                    <input
                      type='password'
                      id='current-password'
                      name='current-password'
                      className='block flex-1 w-full bg-transparent border-b py-2 px-4 mt-1 outline-none focus:border-main'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='current-password'
                      className='block text-sm font-medium leading-5 text-gray-700'
                    >
                      새로운 비밀번호
                    </label>
                    <input
                      type='password'
                      id='new-password'
                      name='new-password'
                      className='block flex-1 w-full bg-transparent border-b py-2 px-4 mt-1 outline-none focus:border-main'
                    />
                  </div>
                </div>
                <div className='flex justify-end items-center w-full'>
                  <button className='w-fit bg-main text-white p-2 mt-2 rounded-md text-sm hover:bg-mainDark'>
                    비밀번호 변경
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : null}
        {/* 회원 탈퇴 */}
        <div className='md:col-span-1 font-medium border-b py-4  md:py-0'>
          회원 탈퇴
        </div>
        {/* TODO: 문구 변경 필요 */}
        <div className='bg-slate-100 md:col-span-2 rounded-md p-8 space-y-6'>
          <div className='text-gray-400 text-sm'>
            회원 탈퇴 후, 계정 복구는 불가능 합니다.
            <br />
            작성한 게시물은 삭제되지 않으며, CHCHATS으로
            소유권이 귀속됩니다.
          </div>
          <div className='space-x-2 flex items-center justify-between'>
            <div className='text-sm space-x-2 flex items-center'>
              <input
                type='checkbox'
                id='delete-account'
                name='delete-account'
              />
              <label htmlFor='delete-account'>
                해당 사항을 숙지하였으며, 동의합니다.
              </label>
            </div>
            <button className='w-fit bg-red-500 text-white p-2 mt-2 rounded-md text-sm hover:bg-red-600'>
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
