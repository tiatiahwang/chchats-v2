'use client';

import Image from 'next/image';
import { Icons } from '../Icons';
import Button from '../ui/Button';
import { toast } from 'react-toastify';
import { CommentCreateRequest } from '@/lib/validator/comment';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { useState } from 'react';
import { useCustomToast } from '@/hooks/use-custom-toast';

interface NewCommentProps {
  postId: string;
  replyToId?: string;
  session: Session | null;
}

const NewComment = ({
  postId,
  replyToId,
  session,
}: NewCommentProps) => {
  const router = useRouter();
  const { loginToast } = useCustomToast();
  const [input, setInput] = useState<string>('');

  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async ({
      postId,
      text,
      replyToId,
    }: CommentCreateRequest) => {
      const payload: CommentCreateRequest = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.post(
        '/api/comments/create',
        payload,
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          loginToast();
        }
      }
      return toast.error(
        '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
        {
          className: 'text-sm whitespace-pre-line',
        },
      );
    },
    onSuccess: () => {
      router.refresh();
      setInput('');
    },
  });

  return (
    <>
      {!session?.user ? (
        // 비로그인시 노출되는 버튼
        <div className='flex items-center text-gray-500'>
          <button
            className='hover:text-main text-sm py-4'
            onClick={() => loginToast()}
          >
            댓글 쓰기
          </button>
        </div>
      ) : (
        // 로그인한 경우에만 댓글 작성이 가능
        <>
          <div className='flex space-x-4'>
            {session?.user?.image ? (
              // 유저 아바타
              <div className='relative aspect-square h-6 w-6 rounded-full'>
                <Image
                  fill
                  src={session?.user.image!}
                  alt='user avatar'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
            ) : (
              <Icons.user className='w-6 h-6 border-[1px] p-1 rounded-full border-slate-900' />
            )}
            {/* 댓글 작성 */}
            <textarea
              className='text-sm bg-transparent placeholder:text-sm whitespace-pre-line resize-none rounded-md flex-1 focus:outline-none border-[1px] p-2'
              placeholder='좋은 영향을 주고 받는 댓글을 남겨주세요 :)'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
            />
          </div>
          {/* 댓글 작성 버튼 */}
          <div className='flex items-center justify-end mt-4'>
            <Button
              type='base'
              disabled={isLoading}
              isLoading={isLoading}
              width='w-fit'
              text='작성하기'
              onClick={() => {
                if (input.length === 0) {
                  return toast.warning(
                    '댓글 내용을 입력해주세요.',
                    {
                      className: 'text-sm',
                    },
                  );
                }
                createComment({
                  postId,
                  text: input,
                  replyToId,
                });
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default NewComment;
