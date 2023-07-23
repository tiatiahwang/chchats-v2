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
      subcategory: {
        select: {
          name: true,
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
            className='flex justify-between items-center'
          >
            <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
              <div className='text-[10px] bg-main px-1 rounded-md text-white'>
                {post.subcategory.name}
              </div>
              <div>{post.title}</div>
            </div>
            <div className='flex items-center space-x-1'>
              <Icons.comment className='w-3 h-3' />
              <span className='text-xs'>2</span>
            </div>
          </div>
        ))
      ) : (
        <div>NO POST</div>
      )}
    </div>
  );
};

export default PostList;
