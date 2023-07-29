import NewPost from '@/components/post/NewPost';
import Skeleton from '@/components/ui/Skeleton';
import { getAllCategories } from '@/lib/utils';
import { Suspense } from 'react';

const NewPostLoading = () => {
  return (
    <>
      <div className='py-4 space-y-2 w-full'>
        <Skeleton className='w-1/5 h-[25px]' />
        <div className='space-y-2 border-y-[1px] py-4'>
          <div className='md:flex md:items-center md:space-x-2 space-y-2 md:space-y-0'>
            <Skeleton className='w-1/5 h-[25px]' />
            <Skeleton className='w-4/5 h-[25px]' />
          </div>
          <div className='md:flex md:items-center md:space-x-2'>
            <Skeleton className='w-1/5 h-[25px]' />
            <Skeleton className='w-4/5 h-[25px]' />
          </div>
        </div>
      </div>
      <Skeleton className='w-full h-[500px]' />
    </>
  );
};

const Page = async ({
  params: { category },
}: {
  params: { category: string };
}) => {
  const categories = await getAllCategories();
  const currentCategory = categories.find(
    (cate) => cate.ref === category,
  );
  return (
    <Suspense fallback={<NewPostLoading />}>
      <NewPost
        categories={categories}
        currentCategory={currentCategory!}
      />
    </Suspense>
  );
};

export default Page;
