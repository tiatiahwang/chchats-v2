import Link from 'next/link';
import { Icons } from '../Icons';
import { db } from '@/lib/db';
import { formatTime } from '@/lib/utils';

interface PostCardProps {
  categoryId?: number;
  subcategoryId?: number;
}

const PostCard = async ({
  categoryId,
  subcategoryId,
}: PostCardProps) => {
  let posts;
  if (categoryId) {
    posts = await db.post.findMany({
      where: {
        categoryId,
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
        category: {
          select: { ref: true },
        },
        subcategory: {
          select: { name: true, ref: true },
        },
      },
    });
  }
  if (subcategoryId) {
    posts = await db.post.findMany({
      where: {
        subcategoryId,
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
        category: {
          select: { ref: true },
        },
        subcategory: {
          select: { name: true, ref: true },
        },
      },
    });
  }

  if (!posts) return;
  return (
    <>
      {posts.length > 0 ? (
        posts?.map((post) => (
          <div
            key={post.id}
            className='rounded-md bg-shite shadow'
          >
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
                        subcategoryId === undefined
                          ? 'pl-2'
                          : ''
                      }`}
                    >
                      {post.author.username}
                    </span>
                    <span className='px-1'>•</span>
                    {formatTime(post.createdAt)}
                  </div>
                  {/* 댓글 */}
                  {/* TODO: here */}
                  <div className='w-fit flex items-center justify-end gap-1'>
                    <Icons.comment className='h-3 w-3' />0
                  </div>
                </div>
                <Link
                  href={
                    categoryId
                      ? `${post.category.ref}/${post.subcategory.ref}/${post.id}`
                      : '/'
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
        ))
      ) : (
        <div>NO POST</div>
      )}
    </>
  );
};

export default PostCard;
