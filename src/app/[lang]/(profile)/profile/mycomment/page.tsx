import MyComment from '@/components/profile/MyComment';
import ProfileNav from '@/components/profile/ProfileNav';
import { Locale } from '@/i18n.config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getDictionary } from '@/lib/dictionary';

const Page = async ({
  params,
}: {
  params: { lang: Locale };
}) => {
  const lang = params.lang ?? 'en';
  const {
    profile: { activities },
  } = await getDictionary(lang);
  const session = await getAuthSession();
  const mycomments = await db.comment.findMany({
    where: {
      authorId: session?.user.id,
    },
    include: {
      post: {
        select: {
          title: true,
          category: {
            select: {
              eng: true,
              name: true,
              ref: true,
            },
          },
          subcategory: {
            select: {
              eng: true,
              name: true,
              ref: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    // TODO
    // take: INFINITE_SCROLL_LIMIT,
  });

  // TODO: LOADING
  if (!mycomments) return;
  return (
    <div className='w-full px-4'>
      {session?.user ? (
        <ProfileNav
          text={activities}
          user={session?.user!}
        />
      ) : null}
      <MyComment
        lang={lang}
        text={activities}
        initialComments={mycomments}
      />
    </div>
  );
};

export default Page;
