import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';
import Button from '../ui/Button';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CommentCreateRequest } from '@/lib/validator/comment';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface NewCommentProps {
  postId: string;
}

const NewComment = ({ postId }: NewCommentProps) => {
  const { data: session } = useSession();
  const { loginToast } = useCustomToast();
  const { register, handleSubmit } = useForm();

  const { mutate: createComment } = useMutation({
    mutationFn: async ({
      postId,
      text,
    }: CommentCreateRequest) => {
      const payload: CommentCreateRequest = {
        postId,
        text,
      };
      const { data } = await axios.post(
        '/api/comments/create',
        payload,
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          toast.error(error.response.data, {
            theme: 'light',
            className: 'text-sm whitespace-pre-line',
          });
        }
      }
    },
    onSuccess: (data) => {
      console.log(data);
      // router.push(`${url}`);
    },
  });

  const onValid = ({ text }: CommentCreateRequest) => {
    if (!text) {
      return toast.warning('댓글 내용을 입력해주세요.', {
        theme: 'light',
        className: 'text-sm',
      });
    }
    createComment({ text, postId });
  };
  return (
    <div className='border-t-[1px]'>
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
        <form
          className='flex flex-col py-4 gap-4'
          // @ts-ignore
          onSubmit={handleSubmit(onValid)}
        >
          <div className='flex space-x-4'>
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
            <textarea
              {...register('text')}
              className='bg-transparent placeholder:text-sm whitespace-pre-line resize-none rounded-md flex-1 focus:outline-none border-[1px] p-2'
              placeholder='좋은 영향을 주고 받는 댓글을 남겨주세요 :)'
            />
          </div>
          <div className='flex items-center justify-end'>
            <Button
              type='base'
              disabled={false}
              isLoading={false}
              width='w-fit'
              text='작성하기'
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default NewComment;
