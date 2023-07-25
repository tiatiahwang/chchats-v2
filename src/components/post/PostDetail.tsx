'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';
import { Post } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

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
}

interface DeleteRequest {
  postId: string;
}

const PostDetail = ({
  post,
  formattedTime,
}: PostDetailProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: deletePost } = useMutation({
    mutationFn: async ({ postId }: DeleteRequest) => {
      const payload: DeleteRequest = { postId };
      const { data } = await axios.delete(
        '/api/posts/delete',
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
          theme: 'light',
          className: 'text-sm whitespace-pre-line',
        },
      );
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        router.push('/');
      }
    },
  });
  const handleDelete = () => {
    const postId = post.id;
    deletePost({ postId });
  };
  return (
    <>
      {/* 상단 - 카테고리  */}
      <div className=' text-gray-500'>
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
                <Icons.delete
                  className='w-6 h-6 hover:text-main cursor-pointer'
                  onClick={handleDelete}
                />
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
    </>
  );
};

export default PostDetail;
