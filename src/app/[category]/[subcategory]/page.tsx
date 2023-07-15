import PostCard from '@/components/post/PostCard';
import { db } from '@/lib/db';

const Page = async ({
  params: { category, subcategory },
}: {
  params: { category: string; subcategory: string };
}) => {
  const CurrnentSubcategory =
    await db.subcategory.findFirst({
      where: {
        ref: subcategory,
        category: {
          ref: category,
        },
      },
    });

  return (
    <div className='border rounded-md w-full p-4'>
      <div>
        <h1 className='font-bold text-3xl md:text-4xl h-14'>
          {CurrnentSubcategory?.name}
        </h1>
        <div className='flex items-center justify-end'>
          <button className='p-2 rounded-md bg-main hover:bg-mainDark text-white'>
            글 남기기
          </button>
        </div>
      </div>
      <ul className='py-2 space-y-2'>
        <PostCard />
      </ul>
    </div>
  );
};

export default Page;
