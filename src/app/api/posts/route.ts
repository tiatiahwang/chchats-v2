import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { limit, page, categoryId, subcategoryId } = z
      .object({
        limit: z.string(),
        page: z.string(),
        categoryId: z.string(),
        subcategoryId: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
        categoryId: url.searchParams.get('categoryId'),
        subcategoryId:
          url.searchParams.get('subcategoryId'),
      });

    let whereClause = {};

    if (subcategoryId) {
      whereClause = {
        subcategoryId: +subcategoryId,
      };
    } else {
      whereClause = {
        categoryId: +categoryId,
      };
    }

    const posts = await db.post.findMany({
      where: whereClause,
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response('유효하지 않은 데이터 입니다.', {
        status: 422,
      });
    }
    return new Response(
      '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
      {
        status: 500,
      },
    );
  }
}
