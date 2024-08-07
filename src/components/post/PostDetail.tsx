'use client';

import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { Post, Vote, VoteType } from '@prisma/client';

import { Icons } from '@/components/Icons';
import Modal from '@/components/ui/Modal';
import PostVote from '@/components/post/PostVote';
import { useCustomToast } from '@/hooks/use-custom-toast';

interface ExtendedPost extends Post {
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
  category: {
    eng: string;
    name: string;
    ref: string | null;
  };
  subcategory: {
    eng: string;
    name: string;
    ref: string | null;
  };
  votes: Vote[];
}

interface PostDetailProps {
  lang: string;
  post: ExtendedPost;
  formattedTime: string;
  isScrapped: boolean;
}

interface APIRequest {
  postId: string;
}

const PostDetail = ({ lang, post, formattedTime, isScrapped }: PostDetailProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const [toggleScrap, setToggleScrap] = useState<boolean>(isScrapped);
  const [showModal, setShowModal] = useState<boolean>(false);

  let _votesAmount: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (post?.votes) {
    _votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1;
      if (vote.type === 'DOWN') return acc - 1;
      return acc;
    }, 0);

    _currentVote = session?.user ? post.votes.find((vote) => vote.userId === session?.user.id)?.type : null;
  }

  const { mutate: deletePost, isLoading: deleteLoading } = useMutation({
    mutationFn: async ({ postId }: APIRequest) => {
      const payload: APIRequest = { postId };
      const { data } = await axios.delete('/api/posts/delete', { data: payload });
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      return toast.error('알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.', {
        className: 'text-sm whitespace-pre-line',
      });
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        setShowModal(false);
        router.push('/');
      }
    },
  });

  const { mutate: scrapPost } = useMutation({
    mutationFn: async ({ postId }: APIRequest) => {
      const payload: APIRequest = { postId };
      const { data } = await axios.post('/api/posts/scrap', payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      return toast.error('알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.', {
        className: 'text-sm whitespace-pre-line',
      });
    },
    onSuccess: (data) => {
      setToggleScrap((prev) => !prev);
      if (data === 'OK') {
        return toast.success('게시글이 스크랩되었습니다.', {
          className: 'text-sm',
        });
      }
      if (data === 'DELETED') {
        return toast.success('스크랩을 취소했습니다.', {
          className: 'text-sm',
        });
      }
    },
  });
  console.log(session);
  return (
    <>
      {/* 상단 - 카테고리  */}
      <div className='text-gray-400 text-sm'>
        {post.categoryId !== 5 && (
          <>
            <Link href={`/${lang}/${post.category.ref}`} className='hover:text-main'>
              {lang === 'en' ? post.category.eng : post.category.name}
            </Link>{' '}
            {'>'}{' '}
          </>
        )}
        <Link href={`/${lang}/${post.category.ref}/${post.subcategory.ref}`} className='hover:text-main'>
          {lang === 'en' ? post.subcategory.eng : post.subcategory.name}
        </Link>
      </div>
      {/* 유저정보 및 글 */}
      <div className='mt-4'>
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
            {/* 닉네임/글작성시간/조회수 */}
            <div className='text-gray-500'>
              <span className='pl-2'>{post.author.username}</span>
              <span className='px-1'>•</span>
              <span>{formattedTime}</span>
              <span className='px-1'>•</span>
              <span>
                {lang === 'en' ? 'views' : '조회수'} {post.viewCount}
              </span>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {/* edit/delete는 내 글인 경우에만 화면에 노출*/}
            {post.author.id === session?.user?.id && (
              <>
                <Icons.edit
                  className='w-6 h-6 hover:text-main cursor-pointer'
                  onClick={() => router.push(`/${post.category.ref}/${post.subcategory.ref}/${post.id}/edit`)}
                />
                <Icons.delete className='w-6 h-6 hover:text-main cursor-pointer' onClick={() => setShowModal(true)} />
              </>
            )}
            {session?.user && (
              <Icons.scrap
                className={`w-6 h-6 cursor-pointer ${
                  toggleScrap
                    ? 'text-main fill-main hover:fill-mainDark hover:text-mainDark'
                    : 'fill-none hover:text-main'
                }`}
                onClick={() => scrapPost({ postId: post.id })}
              />
            )}
          </div>
        </div>
        {/* 글 제목 */}
        <h1 className='text-4xl font-bold py-8'>{post.title}</h1>
        {/* 글 내용 */}
        <div className='text-base leading-8 post-detail' dangerouslySetInnerHTML={{ __html: post.content }} />
        {/* 글 추천/반대 */}
        <PostVote postId={post.id} initialVoteAmount={_votesAmount} initialVote={_currentVote} />
      </div>
      {showModal && (
        <Modal
          lang={lang}
          isLoading={deleteLoading}
          text={lang === 'en' ? 'Are you sure to delete this post?' : '정말 삭제하시겠어요?'}
          open={showModal}
          onClose={() => setShowModal(false)}
          buttonText={lang === 'en' ? 'Delete' : '삭제'}
          className='bg-red-400 hover:bg-red-500 px-4'
          handleButton={() => deletePost({ postId: post.id })}
        />
      )}
    </>
  );
};

export default PostDetail;
