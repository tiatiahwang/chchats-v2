'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FC } from 'react';
import { Icons } from '../Icons';

interface CommentListProps {
  isProfile: boolean;
}

const CommentList: FC<CommentListProps> = ({
  isProfile = false,
}) => {
  const { data: session } = useSession();
  return (
    <div className='space-y-2'>
      <div className='border-t-[1px] space-y-2'>
        <div className='flex justify-between items-center text-xs pt-4'>
          <div className='flex items-center space-x-2'>
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
            <span className='pl-2'>티아티아</span>
            <span>·</span>
            <span>2일전</span>
          </div>
          <div className='flex itmes-center'></div>
        </div>
        <div className='py-2'>고민이 뭐에요?</div>
      </div>
      <div className='border-t-[1px] space-y-2'>
        <div className='flex justify-between items-center text-xs pt-4'>
          <div className='flex items-center space-x-2'>
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
            <span className='pl-2'>티아티아</span>
            <span>·</span>
            <span>2일전</span>
          </div>
          <div className='flex itmes-center'></div>
        </div>
        <div className='py-2'>고민이 뭐에요?</div>
      </div>
      <div className='border-t-[1px] space-y-2'>
        <div className='flex justify-between items-center text-xs pt-4'>
          <div className='flex items-center space-x-2'>
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
            <span className='pl-2'>티아티아</span>
            <span>·</span>
            <span>2일전</span>
          </div>
          <div className='flex itmes-center'></div>
        </div>
        <div className='py-2'>고민이 뭐에요?</div>
      </div>
    </div>
  );
};

export default CommentList;
