'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { INFINITE_SCROLL_LIMIT } from '@/config';
import axios from 'axios';
import PostCard from './PostCard';
import {
  ExtendedCategory,
  ExtendedPostWithUser,
} from '@/types/db';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { Subcategory } from '@prisma/client';
import Link from 'next/link';

interface PostCardListProps {
  initialPosts: ExtendedPostWithUser[];
  currentCategory?: ExtendedCategory;
  currentSubcategory?: Subcategory;
}

const PostCardList = ({
  initialPosts,
  currentCategory,
  currentSubcategory,
}: PostCardListProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { loginToast } = useCustomToast();
  const lastPostRef = useRef<HTMLElement>(null);

  const [selectedSubcategory, setSelectedsubcategory] =
    useState<number>(currentSubcategory?.id ?? -1);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const categoryId = currentCategory
    ? currentCategory.id
    : currentSubcategory?.categoryId;

  const { data, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['infinite-query'],
      async ({ pageParam = 1 }) => {
        const query =
          `/api/posts?limit=${INFINITE_SCROLL_LIMIT}&page=${pageParam}&categoryId=${categoryId}` +
          (!!currentSubcategory?.id
            ? `&subcategoryId=${currentSubcategory?.id}`
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
      {currentCategory && currentCategory.id !== 5 && (
        <ul className='flex items-center space-x-2 overflow-x-scroll scrollbar-hide py-2'>
          <Link href={currentCategory.url}>
            <li
              className={`${
                selectedSubcategory === -1
                  ? 'bg-gray-200'
                  : 'hover:bg-gray-100'
              } p-2 rounded-md cursor-pointer inline whitespace-nowrap text-sm md:text-base`}
            >
              전체
            </li>
          </Link>
          {currentCategory &&
            currentCategory.subcategories?.map(
              (category) => (
                <Link href={category.url} key={category.id}>
                  <li
                    className={`${
                      selectedSubcategory === category.id
                        ? 'bg-gray-200'
                        : 'hover:bg-gray-100'
                    } p-2 rounded-md cursor-pointer inline whitespace-nowrap text-sm md:text-base`}
                    onClick={() =>
                      setSelectedsubcategory(category.id)
                    }
                  >
                    {category.name}
                  </li>
                </Link>
              ),
            )}
        </ul>
      )}
      <div className='flex items-center justify-end'>
        {currentSubcategory?.categoryId === 5 ? (
          <>
            {session?.user?.role === 'ADMIN' ? (
              <div
                className='p-2 rounded-md bg-main hover:bg-mainDark text-white mb-2 cursor-pointer'
                onClick={() => {
                  router.push(
                    `${currentSubcategory?.url}/create`,
                  );
                }}
              >
                글쓰기
              </div>
            ) : null}
          </>
        ) : (
          <div
            className='p-2 rounded-md bg-main hover:bg-mainDark text-white mb-2 cursor-pointer'
            onClick={() => {
              if (!session?.user) {
                return loginToast();
              }

              if (currentCategory) {
                router.push(
                  `${currentCategory?.url}/create`,
                );
              } else {
                router.push(
                  `${currentSubcategory?.url}/create`,
                );
              }
            }}
          >
            글쓰기
          </div>
        )}
      </div>
      <ul className='border overflow-scroll rounded-md p-4'>
        {posts.length > 0 ? (
          <>
            {posts?.map((post, index) => {
              if (index === posts.length - 1) {
                return (
                  <li key={post.id} ref={ref}>
                    <PostCard
                      post={post}
                      subcategoryId={
                        currentSubcategory?.id ?? undefined
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
                      currentSubcategory?.id ?? undefined
                    }
                  />
                );
              }
            })}
          </>
        ) : (
          <div className='flex w-full justify-center'>
            아직 남겨진 글이 없습니다.
          </div>
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
      </ul>
    </>
  );
};

export default PostCardList;
