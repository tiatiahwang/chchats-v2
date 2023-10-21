'use client';

import { useForm } from 'react-hook-form';
import { Icons } from '../Icons';
import { useRouter } from 'next/navigation';

const Search = ({ text }: { text: string }) => {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();

  return (
    <div className='flex items-center text-sm bg-transparent py-2 px-4 rounded-full border focus-within:border-main transition-colors '>
      <Icons.search className='w-3.5 h-3.5 text-gray-400' />
      <form
        onSubmit={handleSubmit((e) => {
          router.push(`/search?keyword=${e.keyword}`);
          setTimeout(() => setValue('keyword', ''), 500);
        })}
      >
        <input
          className='bg-transparent focus:outline-none pl-2 focus:border-main '
          type='text'
          placeholder={text}
          {...register('keyword')}
        />
      </form>
    </div>
  );
};

export default Search;
