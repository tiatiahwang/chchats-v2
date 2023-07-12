'use client';

import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserJoinValidator } from '@/lib/validator/user';
import { Icons } from './Icons';

interface FormProps {
  email: string;
  password: string;
  username: string;
}

const Join = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormProps>({
    mode: 'onChange',
    resolver: zodResolver(UserJoinValidator),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorFromServer, setErrorFromServer] =
    useState(false);

  const onValid = async (formData: FormProps) => {
    if (errorMessage !== '') setErrorMessage('');
    setIsLoading(true);

    const { email, password, username } = formData;

    try {
      const { data } = await axios.post('/api/join', {
        email,
        password,
        username,
      });

      // TODO: 회원가입 완료시, 모달 띄운 후에 이동하는게 낫지 않을까? - 일단 고려해보기
      if (data === 'OK') {
        setIsLoading(false);
        router.push('/login');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setIsLoading(false);
          setErrorFromServer(true);
          setErrorMessage(error.response.data);
        }
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className='space-y-8'
    >
      <div>
        <div className='mb-4 space-y-1'>
          <label htmlFor='email' className='text-sm'>
            이메일
          </label>
          <input
            {...register('email')}
            id='email'
            type='email'
            className={`w-full bg-transparent border rounded-lg p-2 outline-none ${
              errors?.email
                ? 'border-red-500'
                : 'focus:border-main'
            }`}
            aria-invalid={Boolean(errors.email)}
            onChange={() => setErrorFromServer(false)}
          />
          {errors?.email?.message && (
            <span className='text-red-500 text-sm'>
              {errors.email.message}
            </span>
          )}
        </div>
        <div className='mb-4 space-y-1'>
          <label htmlFor='password' className='text-sm'>
            비밀번호
          </label>
          <input
            {...register('password')}
            id='password'
            type='password'
            className={`w-full bg-transparent border rounded-lg p-2 outline-none ${
              errors?.password
                ? 'border-red-500'
                : 'focus:border-main'
            }`}
            aria-invalid={Boolean(errors.password)}
            onChange={() => setErrorFromServer(false)}
          />
          {errors?.password?.message && (
            <span className='text-red-500 text-sm'>
              {errors.password.message}
            </span>
          )}
        </div>
        <div className='space-y-1'>
          <label htmlFor='username' className='text-sm'>
            닉네임
          </label>
          <input
            {...register('username', {
              required: '필수 입력 사항입니다.',
            })}
            id='username'
            type='text'
            className={`w-full bg-transparent border rounded-lg p-2 outline-none ${
              errors?.username
                ? 'border-red-500'
                : 'focus:border-main'
            }`}
            aria-invalid={Boolean(errors.username)}
            onChange={() => setErrorFromServer(false)}
          />
          {errors?.username?.message && (
            <span className='text-red-500 text-sm'>
              {errors.username.message}
            </span>
          )}
        </div>
      </div>
      {errorMessage && (
        <div className='text-red-500 text-sm flex space-x-1 justify-center items-center font-bold'>
          <Icons.exclamation className='h-4 w-4 text-red-500' />
          <span>{errorMessage}</span>
        </div>
      )}
      <button
        type='submit'
        disabled={!isValid || isLoading || errorFromServer}
        className={`w-full rounded-lg p-2 mt-4 text-white ${
          isValid && !isLoading && !errorFromServer
            ? 'bg-main cursor-pointer'
            : 'bg-gray-300'
        }`}
      >
        {isLoading ? '로딩중' : '회원 가입'}
      </button>
    </form>
  );
};

export default Join;
