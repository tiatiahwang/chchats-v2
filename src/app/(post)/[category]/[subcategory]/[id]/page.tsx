import WebSideBar from '@/components/WebSideBar';
import PostDetail from '@/components/post/PostDetail';
import { getAllCategories } from '@/lib/utils';

const Page = async () => {
  const categories = await getAllCategories();
  return (
    <>
      <WebSideBar categories={categories} />
      <PostDetail />
    </>
  );
};

export default Page;
