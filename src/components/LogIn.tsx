'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginValidator } from '@/lib/validator/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from './Icons';

interface FormProps {
  email: string;
  password: string;
}

const LogIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormProps>({
    mode: 'onChange',
    resolver: zodResolver(UserLoginValidator),
  });
  const [errorMessage, setErrorMessage] = useState('');

  const onValid = async (formData: FormProps) => {
    const { email, password } = formData;

    const signInResponse = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (signInResponse?.error?.includes('401')) {
      setErrorMessage('가입되어 있지 않은 이메일 입니다.');
    }
    if (signInResponse?.error?.includes('500')) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
    }
    if (!signInResponse?.error) {
      router.push('/');
    }
  };
  return (
    <form
      // @ts-ignore
      onSubmit={handleSubmit(onValid)}
      className='space-y-8'
    >
      <div>
        <div className='mb-4 space-y-1'>
          <label className='text-sm'>이메일</label>
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
          />
          {errors?.email?.message && (
            <span className='text-red-500 text-sm'>
              {errors.email.message}
            </span>
          )}
        </div>
        <div className='space-y-1'>
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
          />
          {errors?.password?.message && (
            <span className='text-red-500 text-sm'>
              {errors.password.message}
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
        disabled={!isValid}
        className={`w-full rounded-lg p-2 mt-4 text-white ${
          isValid ? 'bg-main cursor-pointer' : 'bg-gray-300'
        }`}
      >
        로그인
      </button>
    </form>
  );
};

export default LogIn;
