'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginValidator } from '@/lib/validator/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from './Icons';
import Button from './ui/Button';

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      id='form-submit'
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
          <div className='flex items-center border rounded-lg p-2'>
            <input
              {...register('password')}
              id='password'
              type={showPassword ? 'text' : 'password'}
              className={`w-full bg-transparent outline-none ${
                errors?.password
                  ? 'border-red-500'
                  : 'focus:border-main'
              }`}
              aria-invalid={Boolean(errors.password)}
            />
            {showPassword ? (
              <Icons.eye
                className='w-4 h-4 text-gray-400 cursor-pointer'
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
              />
            ) : (
              <Icons.eyeSlash
                className='w-4 h-4 text-gray-400 cursor-pointer'
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
              />
            )}
          </div>
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
      <Button
        type='auth'
        text='로그인'
        className='mt-4'
        width='w-full'
        disabled={!isValid || isLoading}
        isLoading={isLoading}
        id='form-submit'
      />
    </form>
  );
};

export default LogIn;
