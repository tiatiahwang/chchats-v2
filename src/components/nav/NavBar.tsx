import Link from 'next/link';
import MobileSideMenu from './MobileSideMenu';
import Image from 'next/image';
import Search from './Search';
import { getAuthSession } from '@/lib/auth';
import WebSideMenu from './WebSideMenu';

const NavBar = async () => {
  // const { data: session, status } = useSession();
  const session = await getAuthSession();
  return (
    <div className='fixed top-0 inset-x-0 h-14 border-b border-zinc-200 z-[10] p-2 bg-slate-50'>
      {/* 모바일 - 로고/햄버거아이콘 */}
      {/* 웹 - 로고/서치인풋+프로필 */}
      <div className='max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* 로고 */}
        <div className='md:flex'>
          <Link href='/'>
            <Image
              width={100}
              height={50}
              src='/logo_light.png'
              alt='logo'
            />
          </Link>
        </div>
        {/* 모바일 - 우측 햄버거 아이콘 */}
        <div className='md:hidden'>
          <MobileSideMenu />
        </div>
        {/* 웹 - 우측 서칭인풋+프로필 */}
        <div className='hidden md:flex md:items-center md:space-x-4'>
          <Search />
          <WebSideMenu session={session} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
