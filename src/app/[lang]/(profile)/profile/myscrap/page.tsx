import MyScrap from '@/components/profile/MyScrap';
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
  const myscraps = await db.scrap.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      post: {
        select: {
          title: true,
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
        },
      },
    },
    // TODO
    // take: INFINITE_SCROLL_LIMIT,
  });

  // TODO: LOADING
  if (!myscraps) return;
  return (
    <div className='w-full px-4'>
      {session?.user ? (
        <ProfileNav text={activities} user={session.user} />
      ) : null}
      <MyScrap text={activities} initialScraps={myscraps} />
    </div>
  );
};

export default Page;
