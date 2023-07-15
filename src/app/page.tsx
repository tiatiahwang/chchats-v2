import PostList from '@/components/post/PostList';
import WebSideBar from '@/components/WebSideBar';
import { db } from '@/lib/db';

export default async function Home() {
  const categories = await db.category.findMany({
    where: { isDefault: true },
    include: {
      subcategories: true,
    },
  });
  return (
    <div className='flex text-sm px-2 pb-2'>
      <WebSideBar categories={categories} />
      <div className='grid grid-cols-1 md:grid-cols-2 md:ml-4 w-full gap-4'>
        <PostList category='자유게시판' />
        <PostList category='묻고답하기' />
        <PostList category='온라인마켓' />
        <PostList category='지역소모임' />
        <PostList category='공지사항' />
      </div>
    </div>
  );
}
