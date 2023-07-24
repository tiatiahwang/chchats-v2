'use client';

import Image from 'next/image';
import { Icons } from '../Icons';
import { useSession } from 'next-auth/react';
import Loader from '../ui/Loader';

interface Comment {
  authorId: string;
  createdAt: string;
  id: string;
  postId: string;
  replyToId: string | null;
  text: string;
  updatedAt: Date;
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
}

interface CommentListProps {
  isProfile: boolean;
  comments: Comment[];
}

const CommentList = ({
  isProfile = false,
  comments,
}: CommentListProps) => {
  const { data: session, status } = useSession();
  if (status === 'loading') return <Loader />;

  const handleDelete = () => {
    // todo: MODAL 필요할 듯
    console.log('delete');
  };
  return (
    <div className='space-y-2'>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className='border-t-[1px] space-y-2'
        >
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
                <span>{comment.createdAt}</span>
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
        </div>
      ))}
    </div>
  );
};

export default CommentList;
