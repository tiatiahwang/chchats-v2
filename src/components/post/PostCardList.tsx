'use client';

import { useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { INFINITE_SCROLL_LIMIT } from '@/config';
import axios from 'axios';
import PostCard from './PostCard';
import { ExtendedPostWithUser } from '@/types/db';
import Image from 'next/image';

interface PostCardListProps {
  initialPosts: ExtendedPostWithUser[];
  categoryId?: number;
  subcategoryId?: number;
}

const PostCardList = ({
  initialPosts,
  categoryId,
  subcategoryId,
}: PostCardListProps) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['infinite-query'],
      async ({ pageParam = 1 }) => {
        const query =
          `/api/posts?limit=${INFINITE_SCROLL_LIMIT}&page=${pageParam}&categoryId=${categoryId}` +
          (!!subcategoryId
            ? `&subcategoryId=${subcategoryId}`
            : '');
        const { data } = await axios.get(query);
        return data as ExtendedPostWithUser[];
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
    <>
      {posts.length > 0 ? (
        <ul>
          {posts?.map((post, index) => {
            if (index === posts.length - 1) {
              return (
                <li key={post.id} ref={ref}>
                  <PostCard
                    post={post}
                    subcategoryId={
                      subcategoryId! ?? undefined
                    }
                  />
                </li>
              );
            } else {
              return (
                <PostCard
                  post={post}
                  key={post.id}
                  subcategoryId={
                    subcategoryId! ?? undefined
                  }
                />
              );
            }
          })}
        </ul>
      ) : (
        <div>NO POST</div>
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
    </>
  );
};

export default PostCardList;
