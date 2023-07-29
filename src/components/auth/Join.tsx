'use client';

import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserJoinValidator } from '@/lib/validator/auth';
import { Icons } from '../Icons';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

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
  const [showPassword, setShowPassword] = useState(false);

  const onValid = async (formData: FormProps) => {
    if (errorMessage !== '') setErrorMessage('');
    setIsLoading(true);

    const { email, password, username } = formData;

    try {
      const { data } = await axios.post('/api/auth/join', {
        email,
        password,
        username,
      });

      if (data === 'OK') {
        toast.success(
          '회원가입 완료!\n잠시 후 로그인 화면으로 이동합니다.',
          {
            hideProgressBar: true,
            autoClose: 1000,
            className: 'text-sm whitespace-pre-line',
          },
        );
        setTimeout(() => router.push('/login'), 2500);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setIsLoading(false);
          setErrorMessage(error.response.data);
        }
      }
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
      <Button
        type='auth'
        text='회원가입'
        className='mt-4'
        width='w-full'
        disabled={!isValid || isLoading}
        isLoading={isLoading}
        id='form-submit'
      />
    </form>
  );
};

export default Join;
