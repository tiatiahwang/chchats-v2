import WebSideBar from '@/components/WebSideBar';
import PostDetail from '@/components/post/PostDetail';
import { db } from '@/lib/db';
import { formatTime, getAllCategories } from '@/lib/utils';

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params: { id } }: PageProps) => {
  const categories = await getAllCategories();
  const post = await db.post.findFirst({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      subcategory: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });
  const comments = await db.comment.findMany({
    where: { postId: id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });
  const commentsWithFormattedTime = comments.map(
    (comment) => ({
      ...comment,
      createdAt: formatTime(comment.createdAt),
    }),
  );
  if (!post) return;
  return (
    <>
      <WebSideBar categories={categories} />
      {/* TODO: loading */}
      <PostDetail
        post={post}
        comments={commentsWithFormattedTime}
        formattedTime={formatTime(post?.createdAt!)}
      />
    </>
  );
};

export default Page;
