import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import NewComment from './NewComment';
import { formatTime } from '@/lib/utils';
import CommentList from './CommentList';

interface CommentsSectionProps {
  postId: string;
}

const CommentSection = async ({
  postId,
}: CommentsSectionProps) => {
  const session = await getAuthSession();
  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
          replies: true,
          _count: {
            select: {
              replies: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  return (
    <div className='flex flex-col mt-4'>
      <hr className='w-full h-px my-6' />
      <div className='mb-4'>{comments.length}개의 댓글</div>
      <NewComment postId={postId} session={session} />
      <div className='flex flex-col gap-y-4 mt-4'>
        {comments
          .filter((comment) => !comment.replyToId)
          .map((comment) => {
            return (
              <div
                key={comment.id}
                className='flex flex-col'
              >
                <div className='mb-2'>
                  <CommentList
                    comment={comment}
                    postId={postId}
                    formattedTime={formatTime(
                      comment.createdAt,
                    )}
                  />
                </div>
                {/* {comment.replies.map((reply) => {
                  return (
                    <div
                      key={reply.id}
                      className='ml-2 py-2 pl-4 border-l-2'
                    >
                      <CommentList
                        comment={reply}
                        postId={postId}
                        formattedTime={formatTime(
                          reply.createdAt,
                        )}
                        isReply={true}
                      />
                    </div>
                  );
                })} */}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
