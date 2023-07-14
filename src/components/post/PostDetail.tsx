'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';
import NewComment from '../comment/NewComment';
import CommentList from '../comment/CommentList';

const PostDetail = () => {
  const { data: session } = useSession();
  return (
    <div className='space-y-6'>
      {/* 상단 - 카테고리  */}
      <div className='text-xs text-gray-500'>
        <span>자유게시판</span>
        <span> / </span>
        <a href='/'>
          <span>고민상담</span>
        </a>
      </div>
      {/* 유저정보 및 글 */}
      <div>
        <div className='flex items-center justify-between text-xs'>
          <div className='flex items-center'>
            {/* 아바타 */}
            {/* TODO: 유저 아바타/닉네임 클릭시 이동경로 */}
            <div>
              {session?.user?.image ? (
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
            </div>
            {/* 닉네임/글작성시간 */}
            <div className='text-gray-500'>
              <span className='pl-2'>티아티아</span>
              <span className='px-1'>•</span>
              <span>2일 전</span>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {/* TODO: edit/delete는 내 글인 경우에만 화면에 노출되게 설정해야함 */}
            <Icons.edit className='w-5 h-5 hover:text-main cursor-pointer' />
            <Icons.delete className='w-5 h-5 hover:text-main cursor-pointer' />
            <Icons.scrap className='w-5 h-5 hover:text-main cursor-pointer' />
          </div>
        </div>
        <h1 className='text-4xl font-bold py-8 leading-6'>
          글 제목이 여기다
        </h1>
        <div className='text-base leading-8'>
          안녕하세요 반가워요 고민이 있어요...
          <br />
          안녕하세요 반가워요 고민이 있어요...
          <br />
          안녕하세요 반가워요 고민이 있어요...
          <br />
          안녕하세요 반가워요 고민이 있어요...
          <br />
          안녕하세요 반가워요 고민이 있어요...
          <br />
          안녕하세요 반가워요 고민이 있어요...
          <br />
        </div>
      </div>
      {/* 댓글 */}
      <div>
        {/* 댓글 작성 */}
        <NewComment />
        {/* 댓글 리스트 */}
        <CommentList isProfile={false} />
      </div>
    </div>
  );
};

export default PostDetail;
