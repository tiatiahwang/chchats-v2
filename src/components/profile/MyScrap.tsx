'use client';

import { INFINITE_SCROLL_LIMIT } from '@/config';
import { ExtendedScrap } from '@/types/db';
import { Activities } from '@/types/dictionary';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface MyScrapProps {
  text: Activities;
  initialScraps: ExtendedScrap[];
}

const MyScrap = ({ text, initialScraps }: MyScrapProps) => {
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
      const query = `/api/profile/myscraps?limit=${INFINITE_SCROLL_LIMIT}&page=${pageParam}`;
      const { data } = await axios.get(query);
      return data as ExtendedScrap[];
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
        pages: [initialScraps],
        pageParams: [1],
      },
    },
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const scraps =
    data?.pages.flatMap((page) => page) ?? initialScraps;

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
          {scraps.length > 0 ? (
            <ul className='m-4'>
              {scraps.map((scrap, index) => {
                if (index === scraps.length - 1) {
                  return (
                    <li key={scrap.postId} ref={ref}>
                      <MyScrapCard scrap={scrap} />
                    </li>
                  );
                } else {
                  return (
                    <MyScrapCard
                      key={scrap.postId}
                      scrap={scrap}
                    />
                  );
                }
              })}
            </ul>
          ) : (
            <div className='text-sm flex justify-center p-4 w-full'>
              {text.noscrap}
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
        </>
      )}
    </div>
  );
};

export default MyScrap;

const MyScrapCard = ({
  scrap,
}: {
  scrap: ExtendedScrap;
}) => {
  const router = useRouter();
  return (
    <div className='rounded-md bg-card shadow mb-2 p-4 space-y-4'>
      <div className='flex justify-between items-center w-full text-xs text-gray-400'>
        {/* 메인/서브 카테고리 */}
        <div className='flex items-center space-x-1'>
          <div
            className='hover:text-main cursor-pointer'
            onClick={() => {
              router.refresh();
              router.push(`/${scrap.post.category.ref}`);
            }}
          >
            {scrap.post.category.name}
          </div>
          <span>{` > `}</span>
          <div
            className='hover:text-main cursor-pointer'
            onClick={() => {
              router.refresh();
              router.push(
                `/${scrap.post.category.ref}/${scrap.post.subcategory.ref}`,
              );
            }}
          >
            {scrap.post.subcategory.name}
          </div>
        </div>
        {/* 댓글 작성 시간 */}
        <span className='text-[10px]'>
          {scrap.createdAt.toLocaleString().split('T')[0]}
        </span>
      </div>
      {/* 댓글 내용 */}
      <div>
        <span
          className='text-sm font-medium hover:text-main cursor-pointer'
          onClick={() => {
            router.refresh();
            router.push(
              `/${scrap.post.category.ref}/${scrap.post.subcategory.ref}/${scrap.postId}`,
            );
          }}
        >
          {scrap.post.title}
        </span>
        <span className='text-xs'>
          {' '}
          게시글을 <span className='text-main'>스크랩</span>
          하셨어요.
        </span>
      </div>
    </div>
  );
};
