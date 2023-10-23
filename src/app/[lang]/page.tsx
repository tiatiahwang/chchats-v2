import PostList from '@/components/PostList';
import WebSideBar from '@/components/WebSideBar';
import { Locale } from '@/i18n.config';
import { getAllCategories } from '@/lib/utils';
import Link from 'next/link';

export default async function Home({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang ?? 'en';
  const categories = await getAllCategories();
  return (
    <div className='flex text-sm pb-2 px-2 md:space-x-8'>
      <WebSideBar lang={lang} categories={categories} />
      <div className='w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 w-full h-min gap-4'>
          {categories?.map((category) => (
            <div
              key={category.id}
              className='border rounded-md w-full p-4'
            >
              <Link
                href={
                  category.id === 5
                    ? '/notice/all'
                    : `${category.url}`
                }
                className='flex justify-between border-b pb-2 cursor-pointer pt-2 hover:text-main'
              >
                <div className='text-2xl font-bold'>
                  {lang === 'en'
                    ? category.eng
                    : category.name}
                </div>
                <span className='text-xs self-end'>
                  {lang === 'en' ? 'see all' : '전체보기'}
                </span>
              </Link>
              <PostList
                lang={lang}
                categoryId={category.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
