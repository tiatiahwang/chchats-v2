import { Icons } from '../Icons';
import { useRouter } from 'next/navigation';
import { Category } from '@prisma/client';
import { db } from '@/lib/db';

interface PostListProps {
  categoryId: number;
}
const PostList = async ({ categoryId }: PostListProps) => {
  console.log(categoryId);
  const posts = await db.category.findMany({
    where: {
      id: categoryId,
    },
    include: {
      posts: true,
    },
    take: 10,
  });
  console.log(posts);
  return (
    <div>
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
