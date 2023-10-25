import NewPost from '@/components/post/NewPost';
import Skeleton from '@/components/ui/Skeleton';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
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
  params: { lang, category, subcategory },
}: {
  params: {
    lang: Locale;
    category: string;
    subcategory: string;
  };
}) => {
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

  return (
    <Suspense fallback={<NewPostLoading />}>
      <NewPost
        lang={lang ?? 'en'}
        text={create}
        categories={categories}
        currentCategory={currentCategory!}
        currentSubcategory={currentSubcategory}
      />
    </Suspense>
  );
};

export default Page;
