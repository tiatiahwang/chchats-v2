import { db } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keyword = url.searchParams.get('keyword');

  if (!keyword) {
    return new Response('잘못된 요청입니다.', {
      status: 400,
    });
  }

  const decoded = decodeURI(keyword);
  const results = await db.post.findMany({
    where: {
      title: {
        contains: decoded,
      },
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      category: {
        select: {
          name: true,
          ref: true,
        },
      },
      subcategory: {
        select: {
          name: true,
          ref: true,
        },
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
  });

  return new Response(JSON.stringify(results));
}
