import NewComment from '@/components/comment/NewComment';
import CommentList from '@/components/comment/CommentList';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatTime } from '@/lib/utils';
import { Comment } from '@/types/dictionary';

interface CommentsSectionProps {
  lang: string;
  text: Comment;
  postId: string;
}

const CommentSection = async ({
  lang,
  text,
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

  // 부모 댓글 수 + 자식 댓글 수
  const countReplyComments = comments
    .map((comment) => comment._count.replies)
    .reduce((prev, cur) => prev + cur, 0);

  const totalComments =
    comments.length + countReplyComments;

  return (
    <div className='flex flex-col'>
      <hr className='w-full h-px my-6' />
      <div className='mb-4'>
        {lang === 'en'
          ? `${totalComments} ${text.title}`
          : `${totalComments}${text.title}`}
      </div>
      <NewComment
        text={text}
        postId={postId}
        session={session}
      />
      <div className='flex flex-col gap-y-4 mt-4'>
        {comments
          .filter((comment) => !comment.replyToId)
          .map((comment) => {
            return (
              <div
                key={comment.id}
                className='flex flex-col'
              >
                <div className='mb-2 border-t-[1px]'>
                  <CommentList
                    lang={lang}
                    text={text}
                    comment={comment}
                    postId={postId}
                    formattedTime={formatTime(
                      comment.createdAt,
                      lang,
                    )}
                  />
                </div>
                {comment.replies.map((reply, index) => {
                  return (
                    <div
                      key={reply.id}
                      className='ml-2 pl-4 border-l-2'
                    >
                      <CommentList
                        lang={lang}
                        text={text}
                        comment={reply}
                        postId={postId}
                        formattedTime={formatTime(
                          reply.createdAt,
                          lang,
                        )}
                        isReply={true}
                      />
                      <div
                        className={` ' ${
                          index !==
                          comment.replies.length - 1
                            ? 'border-b-[1px] border-dashed'
                            : ''
                        }
                          `}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
