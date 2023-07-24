'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';
import NewComment from '../comment/NewComment';
import CommentList from '../comment/CommentList';
import Loader from '../ui/Loader';
import { Post } from '@prisma/client';

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

interface ExtendedPost extends Post {
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
}

interface PostDetailProps {
  post: ExtendedPost;
  formattedTime: string;
  comments: Comment[];
}

const PostDetail = ({
  post,
  formattedTime,
  comments,
}: PostDetailProps) => {
  const { data: session, status } = useSession();
  if (status === 'loading') return <Loader />;

  return (
    <div className='space-y-6 border rounded-md w-full ml-4 p-4'>
      {/* 상단 - 카테고리  */}
      <div className=' text-gray-500 '>
        {post.category.name} {'>'} {post.subcategory.name}
      </div>
      {/* 유저정보 및 글 */}
      <div>
        <div className='flex items-center justify-between text-xs'>
          <div className='flex items-center'>
            {/* 아바타 */}
            {/* TODO: 유저 아바타/닉네임 클릭시 이동경로 */}
            <div>
              {post?.author?.image ? (
                <div className='relative aspect-square h-6 w-6 rounded-full'>
                  <Image
                    fill
                    src={post.author.image}
                    alt='user avatar'
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                  />
                </div>
              ) : (
                <Icons.user className='w-6 h-6 border-[1px] p-1 rounded-full border-slate-900' />
              )}
            </div>
            {/* 닉네임/글작성시간 */}
            <div className='text-gray-500'>
              <span className='pl-2'>
                {post.author.username}
              </span>
              <span className='px-1'>•</span>
              <span>{formattedTime}</span>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {/* edit/delete는 내 글인 경우에만 화면에 노출*/}
            {post.author.id === session?.user.id && (
              <>
                <Icons.edit className='w-6 h-6 hover:text-main cursor-pointer' />
                <Icons.delete className='w-6 h-6 hover:text-main cursor-pointer' />
              </>
            )}
            <Icons.scrap className='w-6 h-6 hover:text-main cursor-pointer' />
          </div>
        </div>
        <h1 className='text-4xl font-bold py-8 leading-6'>
          {post.title}
        </h1>
        <div
          className='text-base leading-8'
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      {/* 댓글 */}
      <div>
        {/* 댓글 작성 */}
        <NewComment postId={post.id} />
        {/* 댓글 리스트 */}
        <CommentList
          isProfile={false}
          comments={comments}
        />
      </div>
    </div>
  );
};

export default PostDetail;
