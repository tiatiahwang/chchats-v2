'use client';

import { useRouter } from 'next/navigation';
import { Icons } from './Icons';
import { ExtendedPost } from '@/types/db';

interface PostBoxProps {
  post: ExtendedPost & {
    _count: {
      comments: number;
    };
  };
}

const PostBox = ({ post }: PostBoxProps) => {
  const router = useRouter();
  return (
    <>
      <div
        onClick={() => {
          router.refresh();
          router.push(
            `${post.category.ref}/${post.subcategory.ref}`,
          );
        }}
        className='text-[10px] border px-1 rounded-md text-main hover:bg-main hover:border-main hover:text-white cursor-pointer'
      >
        {post.subcategory.name}
      </div>
      <div
        onClick={() => {
          router.refresh();
          router.push(
            `/${post.category.ref}/${post.subcategory.ref}/${post.id}`,
          );
        }}
        className='flex flex-1 justify-between items-center hover:text-main cursor-pointer'
      >
        {post.title.length > 20 ? (
          <div>{post.title.slice(0, 20)} ...</div>
        ) : (
          <div>{post.title}</div>
        )}
        <div className='flex items-center space-x-1'>
          <Icons.comment className='w-3 h-3' />
          <span className='text-xs'>
            {post._count.comments}
          </span>
        </div>
      </div>
    </>
  );
};

export default PostBox;
