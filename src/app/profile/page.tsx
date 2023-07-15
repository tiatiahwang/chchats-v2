import ProfileNav from '@/components/profile/ProfileNav';
import { getAuthSession } from '@/lib/auth';

const Page = async () => {
  const session = await getAuthSession();
  return (
    <>
      {session?.user ? (
        <ProfileNav user={session.user} />
      ) : null}
    </>
  );
};
export default Page;
