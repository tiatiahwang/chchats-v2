'use client';

import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

import { Icons } from '@/components/Icons';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCustomToast } from '@/hooks/use-custom-toast';
import {
  CommentCreateRequest,
  CommentDeleteRequest,
  CommentEditRequest,
} from '@/lib/validator/comment';
import { ExtendedCommentWithUser } from '@/types/db';
import { Comment } from '@/types/dictionary';

interface CommentListProps {
  lang: string;
  text: Comment;
  comment: ExtendedCommentWithUser;
  postId: string;
  formattedTime?: string;
  isReply?: boolean;
}

const CommentList = ({
  lang,
  text,
  comment,
  postId,
  formattedTime,
  isReply = false,
}: CommentListProps) => {
  const { data: session } = useSession();
  const { loginToast } = useCustomToast();
  const router = useRouter();

  // 대댓글 관련 상태들
  const [replyInput, setReplyInput] = useState<string>('');
  const [isReplying, setIsReplying] =
    useState<boolean>(false);

  // 댓글 수정 관련 상태들
  const [isEditing, setIsEditing] =
    useState<boolean>(false);
  const [editInput, setEditInput] = useState<string>('');

  // 댓글 삭제 버튼 클릭시, 재확인 하기 위한 모달 열고 닫는 상태
  const [showModal, setShowModal] =
    useState<boolean>(false);

  const { mutate: replyComment, isLoading } = useMutation({
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
          return loginToast();
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
      setReplyInput('');
      setIsReplying(false);
    },
  });

  const {
    mutate: deleteComment,
    isLoading: deleteLoading,
  } = useMutation({
    mutationFn: async ({
      commentId,
      replyToId,
    }: CommentDeleteRequest) => {
      const payload: CommentDeleteRequest = {
        commentId,
        replyToId,
      };
      const { data } = await axios.delete(
        '/api/comments/delete',
        { data: payload },
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
          className: 'text-sm whitespace-pre-line',
        },
      );
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        setShowModal(false);
        router.refresh();
        return toast.success('삭제되었습니다.', {
          className: 'text-sm',
        });
      }
    },
  });

  const { mutate: editComment, isLoading: editLoading } =
    useMutation({
      mutationFn: async ({
        text,
        commentId,
      }: CommentEditRequest) => {
        const payload: CommentEditRequest = {
          text,
          commentId,
        };
        const { data } = await axios.patch(
          '/api/comments/edit',
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
            className: 'text-sm whitespace-pre-line',
          },
        );
      },
      onSuccess: (data) => {
        if (data === 'OK') {
          router.refresh();
          setEditInput('');
          setIsEditing(false);
        }
      },
    });

  const handleDelete = () => {
    deleteComment({
      commentId: comment.id,
      replyToId: comment.replyToId ?? null,
    });
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
          {comment.authorId === session?.user?.id && (
            <div className='flex items-center space-x-2'>
              <Icons.edit
                className='w-4 h-4 hover:text-main cursor-pointer'
                onClick={() => setIsEditing(true)}
              />
              <Icons.delete
                className='w-4 h-4 hover:text-main cursor-pointer'
                onClick={() => setShowModal(true)}
              />
            </div>
          )}
        </div>
      </div>
      {/* 댓글 수정에 따른 댓글 내용 */}
      {isEditing ? (
        <>
          <textarea
            className='w-full text-sm bg-transparent placeholder:text-sm whitespace-pre-line resize-none rounded-md flex-1 focus:outline-none border-[1px] p-2'
            placeholder={comment.text}
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            rows={3}
          />
          <div className='flex items-center justify-end pt-4 space-x-2'>
            <Button
              type='transparent'
              width='w-fit'
              text={text.cancel}
              className='border-none rounded-md hover:bg-gray-400'
              onClick={() => setIsEditing((prev) => !prev)}
            />
            <Button
              type='base'
              disabled={editLoading}
              isLoading={editLoading}
              width='w-fit'
              text={text.edit}
              onClick={() => {
                if (editInput.length === 0) {
                  return toast.warning(
                    '댓글 내용을 입력해주세요.',
                    {
                      className: 'text-sm',
                    },
                  );
                }
                editComment({
                  text: editInput,
                  commentId: comment.id,
                });
              }}
            />
          </div>
        </>
      ) : (
        <div className='py-2 text-sm'>{comment.text}</div>
      )}
      <div className='text-xs text-gray-500 font-medium space-x-4'>
        {!isReply ? (
          <span
            className='hover:text-main cursor-pointer'
            onClick={handleReply}
          >
            {text.addcomment}
          </span>
        ) : null}
        {isReplying ? (
          <div className='pt-4'>
            <div className='flex space-x-4'>
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
                <Icons.user className='w-6 h-6 border-[1px] p-1 rounded-full border-slate-900 text-slate-900' />
              )}
              <textarea
                className='text-sm bg-transparent placeholder:text-sm whitespace-pre-line resize-none rounded-md flex-1 focus:outline-none border-[1px] p-2'
                placeholder={text.placeholder}
                value={replyInput}
                onChange={(e) =>
                  setReplyInput(e.target.value)
                }
                rows={3}
              />
            </div>
            <div className='flex items-center justify-end pt-4 space-x-2'>
              <Button
                type='transparent'
                width='w-fit'
                text={text.cancel}
                className='border-none rounded-md hover:bg-gray-400'
                onClick={() =>
                  setIsReplying((prev) => !prev)
                }
              />
              <Button
                type='base'
                disabled={isLoading}
                isLoading={isLoading}
                width='w-fit'
                text={text.add}
                onClick={() => {
                  if (!replyInput) {
                    return toast.warning(
                      '댓글 내용을 입력해주세요.',
                      {
                        className: 'text-sm',
                      },
                    );
                  }
                  replyComment({
                    postId,
                    text: replyInput,
                    replyToId: comment.id,
                  });
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
      {showModal && (
        <Modal
          lang={lang}
          text={
            lang === 'en'
              ? 'Are you sure to delete this comment?'
              : '정말 삭제하시겠어요?'
          }
          open={showModal}
          onClose={() => setShowModal(false)}
          buttonText={lang === 'en' ? 'Delete' : '삭제'}
          className='bg-red-400 hover:bg-red-500 px-4'
          handleButton={handleDelete}
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
};

export default CommentList;
