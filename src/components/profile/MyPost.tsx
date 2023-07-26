'use client';

import { Post } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExtendedPost = Post & {
  category: {
    name: string;
    ref: string | null;
  };
  subcategory: {
    name: string;
    ref: string | null;
  };
};

interface MyPostProps {
  posts: ExtendedPost[];
}

const MyPost = ({ posts }: MyPostProps) => {
  const router = useRouter();
  return (
    <div className='mt-4'>
      {posts.map((post) => (
        <div
          key={post.id}
          className='rounded-md bg-shite shadow mb-2 p-4 space-y-4'
        >
          <div className='flex justify-between items-center w-full text-xs text-gray-400'>
            {/* 메인/서브 카테고리 */}
            <div>
              {/* TODO: Link로 할지 router로 갈지 생각해볼것 */}
              <Link
                href={`/${post.category.ref}`}
                className='hover:text-main'
              >
                {post.category.name}
              </Link>
              <span>{` > `}</span>
              <Link
                href={`/${post.category.ref}/${post.subcategory.ref}`}
                className='hover:text-main'
              >
                {post.subcategory.name}
              </Link>
            </div>
            {/* 글 작성 시간 */}
            <span className='text-[10px]'>
              {post.createdAt.toLocaleString()}
            </span>
          </div>
          {/* 글 제목 */}
          <div
            className='text-sm font-medium hover:text-main cursor-pointer'
            onClick={() => {
              router.refresh();
              router.push(
                `/${post.category.ref}/${post.subcategory.ref}/${post.id}`,
              );
            }}
          >
            {post.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPost;
