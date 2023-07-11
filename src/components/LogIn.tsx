'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

interface FormProps {
  email: string;
  password: string;
}

const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onValid = (formData: FormProps) => {
    console.log(formData);
    //signIn();
  };
  return (
    <form
      // @ts-ignore
      onClick={handleSubmit(onValid)}
      className='space-y-8'
    >
      <div>
        <div className='mb-4 space-y-1'>
          <label className='text-sm'>이메일</label>
          <input
            {...register('email', {
              required: '필수 입력 사항입니다.',
            })}
            type='email'
            className='w-full bg-transparent border rounded-lg p-2 outline-none focus:border-main'
          />
        </div>
        {/* email 오류 안내 문구 */}
        <div className='space-y-1'>
          <label className='text-sm'>비밀번호</label>
          <input
            {...register('password', {
              required: '필수 입력 사항입니다.',
            })}
            type='password'
            className='w-full bg-transparent border rounded-lg p-2 outline-none focus:border-main'
          />
        </div>
      </div>
      {/* 비밀번호 오류 안내 문구 */}
      <button className='bg-main w-full rounded-lg p-2 mt-4 text-white'>
        로그인
      </button>
    </form>
  );
};

export default LogIn;
