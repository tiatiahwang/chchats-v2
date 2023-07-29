import { db } from '@/lib/db';
import PostBox from './PostBox';

interface PostListProps {
  categoryId: number;
}

const PostList = async ({ categoryId }: PostListProps) => {
  const posts = await db.post.findMany({
    where: {
      categoryId,
    },
    include: {
      category: {
        select: {
          name: true,
          ref: true,
        },
      },
      subcategory: {
        select: {
          name: true,
          ref: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <div className='pt-2 space-y-2'>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className='flex items-center space-x-2 w-full'
          >
            <PostBox post={post} />
          </div>
        ))
      ) : (
        <div>NO POST</div>
      )}
    </div>
  );
};

export default PostList;
