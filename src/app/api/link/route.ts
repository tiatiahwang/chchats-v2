import axios from 'axios';

export async function GET(req: Request) {
  const url = new URL(req.url);
  // editorJS가 자동으로 보내주는 param
  const href = url.searchParams.get('url');

  if (!href) {
    return new Response('올바르지 않은 주소입니다.', {
      status: 400,
    });
  }

  const res = await axios.get(href);

  const titleMatch = res.data.match(
    /<title>(.*?)<\/title>/,
  );
  const title = titleMatch ? titleMatch[1] : '';

  const descriptionMath = res.data.match(
    /<meth name='description' content='(.*?)'/,
  );
  const description = descriptionMath
    ? descriptionMath[1]
    : '';

  const imageMatch = res.data.match(
    /<meta property='og:image' content='(.*?)'/,
  );
  const imageUrl = imageMatch ? imageMatch[1] : '';

  return new Response(
    JSON.stringify({
      sucess: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    }),
  );
}
