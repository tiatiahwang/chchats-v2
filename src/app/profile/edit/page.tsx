import ProfileEdit from '@/components/profile/ProfileEdit';
//import { getAuthSession } from '@/lib/auth';
const Page = async () => {
  // TODO: 여기서 session 받아오고, 없는 경우 로그인페이지로 강제이동?

  // const session = await getAuthSession();
  // if (!session) {
  //   return {
  //     redirect: {
  //       desitation: '/login',
  //       permanent: false,
  //     },
  //   };
  // }
  return <ProfileEdit />;
};

export default Page;
