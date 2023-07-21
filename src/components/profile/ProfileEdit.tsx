'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useCustomToast } from '@/hooks/use-custom-toast';
import Button from '../ui/Button';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EditProfileRequest,
  EditProfileValidator,
} from '@/lib/validator/profile';

// interface FormProps {
//   avatar?: string;
//   username?: string;
//   currentPassword?: string;
//   newPassword?: string;
// }

const ProfileEdit = () => {
  const { data: session } = useSession();
  const [isChecked, setIsChecked] = useState(false);
  const {
    register,
    setError,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<EditProfileRequest>({
    mode: 'onChange',
    resolver: zodResolver(EditProfileValidator),
  });
  const [errorMessage, setErrorMessage] = useState('');
  const { loginToast } = useCustomToast();

  const {
    mutate: changeUsername,
    isLoading: isUsernameLoading,
  } = useMutation({
    mutationFn: async ({
      username,
    }: EditProfileRequest) => {
      const { data } = await axios.post(
        '/api/profile/edit/username',
        {
          username,
        },
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          loginToast();
        }
        if (error.response?.status === 400) {
          setError('username', {
            message: error.response.data,
          });
        }
        if (error.response?.status === 500) {
          toast.error(error.response.data, {
            theme: 'light',
            className: 'text-sm whitespace-pre-line',
          });
        }
      }
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        toast.success('닉네임이 변경되었습니다.', {
          theme: 'light',
          className: 'text-sm',
        });
      }
    },
  });

  const {
    mutate: changePassword,
    isLoading: isPasswordLoading,
  } = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: EditProfileRequest) => {
      const { data } = await axios.post(
        '/api/profile/edit/password',
        {
          currentPassword,
          newPassword,
        },
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          loginToast();
        }
        if (error.response?.status === 500) {
          toast.error(error.response.data, {
            theme: 'light',
            className: 'text-sm whitespace-pre-line',
          });
        }
        if (error.response?.status === 400) {
          setErrorMessage(error.response.data);
        }
      }
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        setValue('currentPassword', '');
        setValue('newPassword', '');
        toast.success('비밀번호가 변경되었습니다.', {
          theme: 'light',
          className: 'text-sm',
        });
      }
    },
  });

  const onChangeUsername = () => {
    const username = getValues('username');
    console.log('username', username);
    console.log('session', session?.user.username);
    if (username === session?.user.username) {
      return setError('username', {
        message: '새로운 닉네임을 입력해주세요',
      });
    }
    if (username === '') {
      return setError('username', {
        message: '닉네임을 입력해주세요.',
      });
    }
    changeUsername({ username });
  };

  const onChangePassword = () => {
    if (errorMessage !== '') setErrorMessage('');
    const currentPassword = getValues('currentPassword');
    const newPassword = getValues('newPassword');

    if (currentPassword === '') {
      setError('currentPassword', {
        message: '현재 비밀번호를 입력해주세요.',
      });
    }
    if (newPassword === '') {
      setError('newPassword', {
        message: '새로운 비밀번호를 입력해주세요.',
      });
    }

    if (currentPassword && newPassword) {
      // 현재 비밀번호와 새로운 비밀번호가 같으면 오류 메세지 출력
      if (currentPassword === newPassword) {
        return setErrorMessage(
          '현재 비밀번호와 새로운 비밀번호가 일치합니다. 다시 입력해주세요.',
        );
      }
      changePassword({ currentPassword, newPassword });
    }
  };

  return (
    <div className='mx-auto max-w-screen-7xl'>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium md:border-b-[1px] pb-4'>
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
              <Button
                type='base'
                disabled={false}
                isLoading={false}
                width='w-fit'
                className='mt-2'
                text='사진 변경'
              />
            </div>
            {/* 이메일 인증 */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-5 text-gray-700'
              >
                이메일
                <span className='text-[10px] ml-1'>
                  (변경불가)
                </span>
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
              {session?.user.provider === 'GOOGLE' && (
                <div className='flex justify-end items-center w-full'>
                  <span className='w-fit text-main p-2 mt-2 rounded-md text-sm'>
                    google 계정으로 로그인
                  </span>
                </div>
              )}
              {/* 일반 로그인 한 경우 이메일 인증 버튼 출력 */}
              {/* TODO: 이메일 인증 로직 필요 */}
              {session?.user?.emailVerified === null &&
                session?.user?.provider ===
                  'CREDENTIALS' && (
                  <div className='flex justify-end items-center w-full'>
                    <Button
                      type='base'
                      disabled={false}
                      isLoading={false}
                      width='w-fit'
                      className='mt-2'
                      text='이메일 인증'
                    />
                  </div>
                )}
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
                {...register('username')}
                type='text'
                id='username'
                name='username'
                className={`block flex-1 w-full bg-transparent border-b py-2 px-4 mt-1 outline-none ${
                  errors?.username
                    ? 'focus:border-red-500'
                    : 'focus:border-main '
                }`}
                defaultValue={session?.user?.username!}
                aria-invalid={Boolean(errors.username)}
              />
              {errors?.username?.message && (
                <span className='text-red-500 text-xs leading-8'>
                  {errors.username.message}
                </span>
              )}
              <div className='flex justify-end items-center w-full'>
                <Button
                  type='base'
                  disabled={
                    isUsernameLoading ||
                    Boolean(errors.username)
                  }
                  isLoading={isUsernameLoading}
                  width='w-fit'
                  className='mt-2'
                  text='닉네임 변경'
                  onClick={onChangeUsername}
                />
              </div>
            </div>
          </div>
        </div>
        {/* 일반 로그인 한 경우, 비밀번호 변경 내용 출력 */}
        {session?.user?.provider === 'CREDENTIALS' ? (
          <>
            <div className='md:col-span-1 font-medium md:border-b-[1px] py-4 md:py-0'>
              비밀번호 변경
            </div>
            <div className='bg-slate-100 md:col-span-2 rounded-md p-8'>
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
                    <span className='text-red-500 text-xs leading-8'>
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
                    <span className='text-red-500 text-xs leading-8'>
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>
              </div>
              {errorMessage && (
                <div className='text-red-500 text-xs flex space-x-1 justify-center items-center font-bold pt-4 pb-2'>
                  <Icons.exclamation className='h-4 w-4 text-red-500' />
                  <span>{errorMessage}</span>
                </div>
              )}
              <div className='flex justify-end items-center w-full'>
                <Button
                  type='base'
                  disabled={
                    isPasswordLoading ||
                    Boolean(errors.currentPassword) ||
                    Boolean(errors.newPassword)
                  }
                  isLoading={isPasswordLoading}
                  width='w-fit'
                  className='mt-2'
                  text='비밀번호 변경'
                  onClick={onChangePassword}
                />
              </div>
            </div>
          </>
        ) : null}
        {/* 회원 탈퇴 */}
        <div className='md:col-span-1 font-medium py-4 md:py-0'>
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
