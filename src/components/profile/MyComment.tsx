'use client';

import { INFINITE_SCROLL_LIMIT } from '@/config';
import { useIntersection } from '@mantine/hooks';
import { Comment } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

type ExtendedComment = Comment & {
  post: {
    title: string;
    category: {
      name: string;
      ref: string | null;
    };
    subcategory: {
      name: string;
      ref: string | null;
    };
  };
};

interface MyCommentProps {
  initialComments: ExtendedComment[];
}

const MyComment = ({ initialComments }: MyCommentProps) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['infinite-query'],
      async ({ pageParam = 1 }) => {
        const query = `/api/profile/mycomments?limit=${INFINITE_SCROLL_LIMIT}&page=${pageParam}`;
        const { data } = await axios.get(query);
        return data as ExtendedComment[];
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
          pages: [initialComments],
          pageParams: [1],
        },
      },
    );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);
  const comments =
    data?.pages.flatMap((page) => page) ?? initialComments;

  return (
    <div className='h-[800px] border overflow-scroll rounded-md'>
      {comments.length > 0 ? (
        <ul className='m-4'>
          {comments.map((comment, index) => {
            if (index === comments.length - 1) {
              return (
                <li key={comment.id} ref={ref}>
                  <MyCommentCard comment={comment} />
                </li>
              );
            } else {
              return (
                <MyCommentCard
                  key={comment.id}
                  comment={comment}
                />
              );
            }
          })}
        </ul>
      ) : (
        <div>NO Comment</div>
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

export default MyComment;

const MyCommentCard = ({
  comment,
}: {
  comment: ExtendedComment;
}) => {
  const router = useRouter();
  return (
    <div
      key={comment.id}
      className='rounded-md bg-shite shadow mb-2 p-4 space-y-4'
    >
      <div className='flex justify-between items-center w-full text-xs text-gray-400'>
        {/* 메인/서브 카테고리 */}
        <div className='flex items-center space-x-1'>
          <div
            className='hover:text-main cursor-pointer'
            onClick={() => {
              router.refresh();
              router.push(`/${comment.post.category.ref}`);
            }}
          >
            {comment.post.category.name}
          </div>
          <span>{` > `}</span>
          <div
            className='hover:text-main cursor-pointer'
            onClick={() => {
              router.refresh();
              router.push(
                `/${comment.post.category.ref}/${comment.post.subcategory.ref}`,
              );
            }}
          >
            {comment.post.subcategory.name}
          </div>
        </div>
        {/* 댓글 작성 시간 */}
        <span className='text-[10px]'>
          {comment.createdAt.toLocaleString()}
        </span>
      </div>
      {/* 댓글 내용 */}
      <div>
        <span
          className='text-sm font-medium hover:text-main cursor-pointer'
          onClick={() => {
            router.refresh();
            router.push(
              `/${comment.post.category.ref}/${comment.post.subcategory.ref}/${comment.postId}`,
            );
          }}
        >
          {comment.post.title}
        </span>
        <span className='text-xs'>
          {' '}
          게시글에 <span className='text-main'>댓글</span>을
          남기셨어요.
        </span>
      </div>
    </div>
  );
};