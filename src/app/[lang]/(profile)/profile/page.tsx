import MyPost from '@/components/profile/MyPost';
import ProfileNav from '@/components/profile/ProfileNav';
import { INFINITE_SCROLL_LIMIT } from '@/config';
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
  const myposts = await db.post.findMany({
    where: {
      authorId: session?.user.id,
    },
    include: {
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
    orderBy: {
      createdAt: 'desc',
    },
    take: INFINITE_SCROLL_LIMIT,
  });

  // TODO: loading
  return (
    <div className='w-full px-4'>
      {session?.user ? (
        <ProfileNav text={activities} user={session.user} />
      ) : null}
      <MyPost
        lang={lang}
        text={activities}
        initialPosts={myposts}
      />
    </div>
  );
};
export default Page;
