import { ExtendedPostWithUser } from '@/types/db';
import Link from 'next/link';
import { Icons } from '../Icons';

interface PostCardProps {
  post: ExtendedPostWithUser;
  subcategoryId?: number;
}
const formatTime = (date: Date) => {
  const start = new Date(date);
  const end = new Date();

  const diff = (+end - +start) / 1000;

  const times = [
    { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
    { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
    { name: '일', milliSeconds: 60 * 60 * 24 },
    { name: '시간', milliSeconds: 60 * 60 },
    { name: '분', milliSeconds: 60 },
  ];

  for (const value of times) {
    const betweenTime = Math.floor(
      diff / value.milliSeconds,
    );

    if (betweenTime > 0) {
      return `${betweenTime}${value.name} 전`;
    }
  }
  return '방금 전';
};

const PostCard = ({
  post,
  subcategoryId,
}: PostCardProps) => {
  return (
    <div className='rounded-md bg-card shadow mb-2'>
      <div className='px-6 py-4 flex justify-between'>
        <div className='w-0 flex-1'>
          {/* 상단 부분 */}
          <div className='max-h-40 flex items-center justify-between text-xs'>
            {/* 카테고리/닉네임/글작성시간 */}
            <div className='text-gray-500'>
              {subcategoryId === undefined &&
              post?.subcategory ? (
                <Link
                  className='text-[10px] border p-1 rounded-sm text-main hover:border-main hover:bg-main hover:text-white'
                  href={`/${post.category.ref}/${post.subcategory.ref}`}
                >
                  <span>{post.subcategory.name}</span>
                </Link>
              ) : null}
              <span
                className={` ${
                  subcategoryId === undefined ? 'pl-2' : ''
                }`}
              >
                {post.author.username}
              </span>
              <span className='px-1'>•</span>
              {formatTime(post.createdAt)}
            </div>
            {/* 조회수/댓글 갯수 */}
            <div className='w-fit flex items-center justify-end space-x-2 text-gray-500 font-medium'>
              <div className='flex items-center space-x-1'>
                <Icons.eye className='h-4 w-4' />
                <span>{post.viewCount}</span>
              </div>
              <div className='flex items-center space-x-1 '>
                <Icons.comment className='h-4 w-4' />
                <span> {post._count.comments}</span>
              </div>
            </div>
          </div>
          <Link
            href={
              subcategoryId === undefined
                ? `${post.category.ref}/${post.subcategory.ref}/${post.id}`
                : `${post.subcategory.ref}/${post.id}`
            }
            className='hover:text-main'
          >
            {/* 글 제목 */}
            <h1 className='text-lg font-semibold pb-2 pt-4 leading-6'>
              {post.title}
            </h1>
            {/* 글 내용 */}
            {/* TODO: slice 필요함 */}
            <div className='relative text-sm max-h-40 w-full overflow-clip'>
              {post.content
                .replace(
                  /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/gi,
                  '',
                )
                .slice(0, 60)}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
