import WebSideBar from '@/components/WebSideBar';
import PostCard from '@/components/post/PostCard';
import { db } from '@/lib/db';

const Page = async ({
  params: { category },
}: {
  params: { category: string };
}) => {
  const categories = await db.category.findMany({
    where: { isDefault: true },
    include: {
      subcategories: true,
    },
  });
  const currentCategory = categories.find(
    (cate) => cate.ref === category,
  );
  return (
    <div className='border rounded-md w-full p-4'>
      <div>
        <h1 className='font-bold text-3xl md:text-4xl h-14'>
          {currentCategory?.name}
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
