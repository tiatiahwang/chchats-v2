import Link from 'next/link';
import { Icons } from '../Icons';
import { db } from '@/lib/db';

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
  });

  return (
    <div className='py-2 space-y-2'>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className='flex items-center space-x-2 w-full'
          >
            <Link
              href={`${post.category.ref}/${post.subcategory.ref}`}
              className='text-[10px] border px-1 rounded-md text-main hover:bg-main hover:border-main hover:text-white'
            >
              {post.subcategory.name}
            </Link>
            <Link
              href={`/${post.category.ref}/${post.subcategory.ref}/${post.id}`}
              className='flex flex-1 justify-between items-center hover:text-main'
            >
              <div>{post.title}</div>
              <div className='flex items-center space-x-1'>
                <Icons.comment className='w-3 h-3' />
                <span className='text-xs'>
                  {post._count.comments}
                </span>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div>NO POST</div>
      )}
    </div>
  );
};

export default PostList;
