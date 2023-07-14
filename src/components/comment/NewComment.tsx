import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';

const NewComment = () => {
  const { data: session } = useSession();
  return (
    <div className='border-t-[1px]'>
      {!session?.user ? (
        <div className='pt-4 flex items-center text-gray-500'>
          <button className='hover:text-main text-sm'>
            댓글 쓰기
          </button>
        </div>
      ) : (
        <form className='flex flex-col py-4 gap-4'>
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
              className='bg-transparent placeholder:text-sm whitespace-pre-line resize-none rounded-md flex-1 focus:outline-none border-[1px] p-2'
              placeholder='좋은 영향을 주고 받는 댓글을 남겨주세요 :)'
            />
          </div>
          <div className='flex items-center justify-end'>
            <button className='p-2 rounded-md bg-main text-white text-sm hover:bg-mainDark'>
              댓글 작성
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewComment;
