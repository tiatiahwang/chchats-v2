import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validator/post';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('로그인을 해주세요.', {
        status: 401,
      });
    }
    const body = await req.json();

    const { title, content, categoryId, subcategoryId } =
      body;

    const post = await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        category: {
          connect: {
            id: categoryId,
          },
        },
        subCategory: {
          connect: {
            id: subcategoryId,
          },
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        subCategory: {
          select: {
            name: true,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        postId: post.id,
        category: post.category[0].name,
        subcategory: post.subCategory[0].name,
      }),
    );
  } catch (error) {
    return new Response(
      '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해 주세요',
      { status: 500 },
    );
  }
}
