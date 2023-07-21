'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginValidator } from '@/lib/validator/auth';
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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const onValid = async (formData: FormProps) => {
    if (errorMessage !== '') setErrorMessage('');
    setIsLoading(true);

    const { email, password } = formData;

    const signInResponse = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (signInResponse?.error) {
      setIsLoading(false);
      setErrorMessage(signInResponse.error);
    }

    if (!signInResponse?.error) {
      router.push('/');
      router.refresh();
    }
  };
  return (
    <form
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
        disabled={!isValid || isLoading}
        className={`w-full rounded-lg p-2 mt-4 text-white ${
          isValid && !isLoading
            ? 'bg-main cursor-pointer'
            : 'bg-gray-300'
        }`}
      >
        {isLoading ? (
          <>
            <svg
              aria-hidden='true'
              role='status'
              className='inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='#138808'
              />
            </svg>
            <span className='text-sm'>로딩중</span>
          </>
        ) : (
          '로그인'
        )}
      </button>
    </form>
  );
};

export default LogIn;
