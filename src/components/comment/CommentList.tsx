'use client';

import { Comment } from '@prisma/client';
import { useState } from 'react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useMutation } from '@tanstack/react-query';
import { CommentCreateRequest } from '@/lib/validator/comment';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Icons } from '../Icons';

type ExtendedComment = Comment & {
  _count: {
    replies: number;
  };
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
  replies: Comment[];
};

interface CommentListProps {
  comment: ExtendedComment;
  postId: string;
  formattedTime?: string;
  isReply?: boolean;
}

const CommentList = ({
  comment,
  postId,
  formattedTime,
  isReply = false,
}: CommentListProps) => {
  const { data: session } = useSession();
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const [input, setInput] = useState<string>('');
  const [isReplying, setIsReplying] =
    useState<boolean>(false);

  const { mutate: replyComment, isLoading } = useMutation({
    mutationFn: async ({
      postId,
      text,
      replyToId,
    }: CommentCreateRequest) => {
      const payload = { postId, text, replyToId };
      const { data } = await axios.patch(
        '/api/comments/create',
        payload,
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      return toast.error(
        '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
        {
          theme: 'light',
          className: 'text-sm whitespace-pre-line',
        },
      );
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    },
  });

  const handleDelete = () => {
    // todo: MODAL 필요할 듯
    console.log('delete');
  };

  const handleReply = () => {
    if (!session?.user) {
      return loginToast();
    }
    // if (
    //   commentRef?.current?.getAttribute('data-username')
    // ) {
    //   const username =
    //     commentRef?.current?.getAttribute('data-username')!;
    //   // setInput(`@${username}`);
    // }
    setIsReplying((prev) => !prev);
  };

  return (
    <div className='space-y-2'>
      {/* 댓글 상단 */}
      <div className='flex justify-between items-center text-xs pt-4'>
        <div className='w-full flex items-center justify-between'>
          {/* 댓글 남긴 유저 정보 */}
          <div className='flex items-center space-x-2'>
            {comment?.author?.image ? (
              <div className='relative aspect-square h-6 w-6 rounded-full'>
                <Image
                  fill
                  src={comment?.author.image!}
                  alt='comment user avatar'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
            ) : (
              <Icons.user className='w-6 h-6 border-[1px] p-1 rounded-full border-slate-900' />
            )}
            <span>{comment.author.username}</span>
            <span>·</span>
            <span>{formattedTime}</span>
          </div>
          {/* 로그인한 유저가 댓글 남긴 유저인 경우 수정/삭제 아이콘 노출 */}
          {comment.authorId === session?.user.id && (
            <div className='flex items-center space-x-2'>
              {/* 댓글 수정 기능 - 나중에 */}
              {/* <Icons.edit className='w-4 h-4 hover:text-main cursor-pointer' /> */}
              <Icons.delete
                className='w-4 h-4 hover:text-main cursor-pointer'
                onClick={handleDelete}
              />
            </div>
          )}
        </div>
        <div className='flex itmes-center'></div>
      </div>
      {/* 댓글 내용 */}
      <div className='py-2 text-sm'>{comment.text}</div>
      {/* <div className='text-xs text-gray-500 font-medium space-x-4'>
        {!isReply ? (
          <span
            className='hover:text-main cursor-pointer'
            onClick={() => setIsReplying((prev) => !prev)}
          >
            댓글 쓰기
          </span>
        ) : null}
        {isReplying ? (
          <div className='pt-2 ml-2 py-2 pl-4 border-l-2'>
            <div className='flex space-x-4'>
              <div className='relative aspect-square h-6 w-6 rounded-full'>
                <Image
                  fill
                  src={session?.user.image!}
                  alt='user avatar'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
              <textarea
                className='text-sm bg-transparent placeholder:text-sm whitespace-pre-line resize-none rounded-md flex-1 focus:outline-none border-[1px] p-2'
                placeholder='좋은 영향을 주고 받는 댓글을 남겨주세요 :)'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
              />
            </div>
            <div className='flex items-center justify-end pt-4'>
              <Button
                type='base'
                disabled={isLoading}
                isLoading={isLoading}
                width='w-fit'
                text='작성하기'
                onClick={() => {
                  if (!input) {
                    return toast.warning(
                      '댓글 내용을 입력해주세요.',
                      {
                        theme: 'light',
                        className: 'text-sm',
                      },
                    );
                  }
                  replyComment({
                    postId,
                    text: input,
                    replyToId: comment.id,
                  });
                }}
              />
            </div>
          </div>
        ) : null}
      </div> */}
    </div>
  );
};

export default CommentList;
