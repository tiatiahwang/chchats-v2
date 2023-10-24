'use client';

import { INFINITE_SCROLL_LIMIT } from '@/config';
import { ExtendedPost } from '@/types/db';
import { Activities } from '@/types/dictionary';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface MyPostProps {
  text: Activities;
  initialPosts: ExtendedPost[];
}

const MyPost = ({ text, initialPosts }: MyPostProps) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query = `/api/profile/myposts?limit=${INFINITE_SCROLL_LIMIT}&page=${pageParam}`;
      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === INFINITE_SCROLL_LIMIT
            ? allPages.length + 1
            : undefined;
        return nextPage;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    },
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts =
    data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <div className='border overflow-scroll rounded-md'>
      {isFetching ? (
        <div className='w-full flex justify-center'>
          <Image
            src='/loader.gif'
            alt='loading'
            width={50}
            height={50}
            unoptimized={true}
          />
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <ul className='m-4'>
              {posts.map((post, index) => {
                if (index === posts.length - 1) {
                  return (
                    <li key={post.id} ref={ref}>
                      <MyPostCard post={post} />
                    </li>
                  );
                } else {
                  return (
                    <MyPostCard key={post.id} post={post} />
                  );
                }
              })}
            </ul>
          ) : (
            <div className='text-sm flex justify-center w-full p-4'>
              {text.nopost}
            </div>
          )}
        </>
      )}
      {isFetchingNextPage ? (
        <div className='flex items-center justify-center'>
          <Image
            src='/loader.gif'
            alt='loading'
            width={50}
            height={50}
            unoptimized={true}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default MyPost;

const MyPostCard = ({ post }: { post: ExtendedPost }) => {
  const router = useRouter();
  return (
    <div
      key={post.id}
      className='rounded-md bg-card shadow mb-2 p-4 space-y-4'
    >
      <div className='flex justify-between items-center w-full text-xs text-gray-400'>
        {/* 메인/서브 카테고리 */}
        <div className='flex items-center space-x-1'>
          <div
            className='hover:text-main cursor-pointer'
            onClick={() => {
              router.refresh();
              router.push(`/${post.category.ref}`);
            }}
          >
            {post.category.name}
          </div>
          <span>{` > `}</span>
          <div
            className='hover:text-main cursor-pointer'
            onClick={() => {
              router.refresh();
              router.push(
                `/${post.category.ref}/${post.subcategory.ref}`,
              );
            }}
          >
            {post.subcategory.name}
          </div>
        </div>
        {/* 글 작성 시간 */}
        <span className='text-[10px]'>
          {post.createdAt.toLocaleString().split('T')[0]}
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
  );
};
