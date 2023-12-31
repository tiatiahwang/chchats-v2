import { Suspense } from 'react';

import NewPost from '@/components/post/NewPost';
import Skeleton from '@/components/ui/Skeleton';
import { Locale } from '@/i18n.config';
import { db } from '@/lib/db';
import { getDictionary } from '@/lib/dictionary';
import { getAllCategories } from '@/lib/utils';

const EditPostLoading = () => {
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

interface PageProps {
  params: {
    lang: Locale;
    category: string;
    subcategory: string;
    id: string;
  };
}

const Page = async ({
  params: { lang, id, category, subcategory },
}: PageProps) => {
  const {
    post: { create },
  } = await getDictionary(lang ?? 'en');
  const categories = await getAllCategories();
  const currentCategory = categories.find(
    (cate) => cate.ref === category,
  );
  const currentSubcategory =
    currentCategory?.subcategories.find(
      (sub) => sub.ref === subcategory,
    );
  const post = await db.post.findFirst({
    where: {
      id,
    },
  });

  if (!post) return;
  return (
    <Suspense fallback={<EditPostLoading />}>
      <NewPost
        lang={lang ?? 'en'}
        text={create}
        post={post}
        categories={categories}
        currentCategory={currentCategory!}
        currentSubcategory={currentSubcategory}
      />
    </Suspense>
  );
};

export default Page;
