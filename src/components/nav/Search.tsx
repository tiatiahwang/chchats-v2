'use client';

import { useForm } from 'react-hook-form';
import { Icons } from '../Icons';

const Search = () => {
  // TODO: 1. search query 가져오기
  // TODO: 2. server에서 가져온 정보 있으면 redirect to search page
  const { register, handleSubmit } = useForm();
  const onValid = ({ keyword }: { keyword: string }) => {
    console.log(keyword);
    //router.push(`/search?keyword=${keyword}`);
  };
  return (
    <div className='flex items-center text-sm bg-transparent py-2 px-4 rounded-full border focus-within:border-main transition-colors '>
      <Icons.search className='w-3.5 h-3.5 text-gray-400' />
      {/* @ts-ignore */}
      <form onSubmit={handleSubmit(onValid)}>
        <input
          className='bg-transparent focus:outline-none pl-2 focus:border-main '
          type='text'
          placeholder='검색'
          {...register('keyword', {
            required: true,
            minLength: 1,
          })}
        />
      </form>
    </div>
  );
};

export default Search;
