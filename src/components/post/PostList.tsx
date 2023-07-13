import { FC } from 'react';
import { Icons } from '../Icons';

interface PostListProps {
  category: string;
}
const PostList: FC<PostListProps> = ({ category }) => {
  return (
    <div className='border rounded-md w-full p-4'>
      <div className='flex justify-between border-b pb-2 cursor-pointer pt-2'>
        <div className='text-2xl font-bold'>{category}</div>
        <span className='text-xs self-end'>전체보기</span>
      </div>
      <div className='py-2 space-y-2'>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2 items-center hover:text-main cursor-pointer'>
            <div className='text-[10px] bg-main px-1 rounded-md text-white'>
              사는얘기
            </div>
            <div>뉴욕 놀러 가고 싶어요</div>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.comment className='w-3 h-3' />
            <span className='text-xs'>2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
