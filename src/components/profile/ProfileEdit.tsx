'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeValidator } from '@/lib/validator/profile';
import axios, { AxiosError } from 'axios';

interface FormProps {
  currentPassword: string;
  newPassword: string;
}

const ProfileEdit = () => {
  const { data: session } = useSession();
  const [isChecked, setIsChecked] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormProps>({
    mode: 'onChange',
    resolver: zodResolver(PasswordChangeValidator),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onValid = async ({
    currentPassword,
    newPassword,
  }: FormProps) => {
    setIsLoading(true);
    if (errorMessage !== '') setErrorMessage('');

    // 현재 비밀번호와 새로운 비밀번호가 같으면 오류 메세지 출력
    if (currentPassword === newPassword) {
      setErrorMessage(
        '현재 비밀번호와 새로운 비밀번호가 일치합니다. 다시 입력해주세요.',
      );
    }
    try {
      const { data } = await axios.post(
        '/api/profile/password',
        {
          currentPassword,
          newPassword,
        },
      );
      if (data === 'OK') {
        // TODO: 비밀번호 변경 완료시 ??
        console.log('password changed.');
        reset();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          //TODO: 로그인을 해주세요 모달? 근데 사실 이런 오류 나면 안되긴 하는데
        }
        if (error?.response) {
          setIsLoading(false);
          setErrorMessage(error.response.data);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <form onSubmit={handleSubmit(onValid)}>
                <div className='space-y-4'>
                  <div>
                    <label
                      htmlFor='currentPassword'
                      className='block text-sm font-medium leading-5 text-gray-700'
                    >
                      현재 비밀번호
                    </label>
                    <input
                      {...register('currentPassword')}
                      type='password'
                      id='currentPassword'
                      name='currentPassword'
                      className={`block flex-1 w-full bg-transparent border-b py-2 px-4 mt-1 outline-none ${
                        errors?.currentPassword
                          ? 'focus:border-red-500'
                          : 'focus:border-main '
                      }`}
                      aria-invalid={Boolean(
                        errors.currentPassword,
                      )}
                    />
                    {errors?.currentPassword?.message && (
                      <span className='text-red-500 text-sm'>
                        {errors.currentPassword.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor='newPassword'
                      className='block text-sm font-medium leading-5 text-gray-700'
                    >
                      새로운 비밀번호
                    </label>
                    <input
                      {...register('newPassword')}
                      type='password'
                      id='newPassword'
                      name='newPassword'
                      className={`block flex-1 w-full bg-transparent border-b py-2 px-4 mt-1 outline-none ${
                        errors?.newPassword
                          ? 'focus:border-red-500'
                          : 'focus:border-main '
                      }`}
                    />
                    {errors?.newPassword?.message && (
                      <span className='text-red-500 text-sm leading-8'>
                        {errors.newPassword.message}
                      </span>
                    )}
                  </div>
                </div>
                {errorMessage && (
                  <div className='text-red-500 text-sm flex space-x-1 justify-center items-center font-bold pt-4 pb-2'>
                    <Icons.exclamation className='h-4 w-4 text-red-500' />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className='flex justify-end items-center w-full'>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`w-fit text-white p-2 mt-2 rounded-md text-sm  ${
                      isLoading
                        ? 'bg-gray-300'
                        : 'bg-main hover:bg-mainDark'
                    }`}
                  >
                    {isLoading ? '로딩중' : '비밀번호 변경'}
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
        <div className='bg-slate-100 md:col-span-2 rounded-md p-8 space-y-6'>
          {/* TODO: 문구 변경 필요 */}
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
                defaultChecked={isChecked}
                onClick={() => setIsChecked(!isChecked)}
              />
              <label htmlFor='delete-account'>
                해당 사항을 숙지하였으며, 동의합니다.
              </label>
            </div>
            <button
              disabled={!isChecked}
              className={`w-fit text-white p-2 mt-2 rounded-md text-sm ${
                isChecked
                  ? 'bg-red-500 cursor-pointer hover:bg-red-600'
                  : 'bg-gray-300'
              }`}
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
