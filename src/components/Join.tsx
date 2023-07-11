'use client';

import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

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
    formState: { errors },
  } = useForm();

  const onValid = async (formData: FormProps) => {
    const { email, password, username } = formData;

    const { data } = await axios.post('/api/join', {
      email,
      password,
      username,
    });

    if (data === 'OK') {
      router.push('/');
    }
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
        <div className='mb-4 space-y-1'>
          <label className='text-sm'>비밀번호</label>
          <input
            {...register('password', {
              required: '필수 입력 사항입니다.',
            })}
            type='password'
            className='w-full bg-transparent border rounded-lg p-2 outline-none focus:border-main'
          />
        </div>
        {/* 비밀번호 오류 안내 문구 */}
        <div className='space-y-1'>
          <label className='text-sm'>닉네임</label>
          <input
            {...register('username', {
              required: '필수 입력 사항입니다.',
            })}
            type='text'
            className='w-full bg-transparent border rounded-lg p-2 outline-none focus:border-main'
          />
        </div>
      </div>
      <button className='bg-main w-full rounded-lg p-2 mt-4 text-white'>
        회원 가입
      </button>
    </form>
  );
};

export default Join;
