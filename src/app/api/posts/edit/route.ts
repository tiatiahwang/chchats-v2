import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validator/post';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('로그인을 해주세요.', {
        status: 401,
      });
    }

    const body = await req.json();

    const {
      title,
      content,
      categoryId,
      subcategoryId,
      postId,
    } = PostValidator.parse(body);

    const post = await db.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        authorId: session.user.id,
        categoryId: categoryId,
        subcategoryId: subcategoryId,
      },
      include: {
        subcategory: {
          select: {
            url: true,
          },
        },
      },
    });
    const url = `${post.subcategory.url}/${post.id}`;
    return new Response(url);
  } catch (error) {
    return new Response(
      '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
      {
        status: 500,
      },
    );
  }
}
