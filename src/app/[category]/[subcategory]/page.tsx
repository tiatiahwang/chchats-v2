import PostCard from '@/components/post/PostCard';

const Page = () => {
  return (
    <div className='border rounded-md w-full p-4'>
      <div>
        <h1 className='font-bold text-3xl md:text-4xl h-14'>
          사는얘기
        </h1>
        <div className='flex items-center justify-end'>
          <button className='p-2 rounded-md bg-main hover:bg-mainDark text-white'>
            글 남기기
          </button>
        </div>
      </div>
      <ul className='py-2 space-y-2'>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </ul>
    </div>
  );
};

export default Page;
