import Link from 'next/link';
import Image from 'next/image';
import { getAuthSession } from '@/lib/auth';
import { Locale } from '@/i18n.config';
import Search from './Search';
import WebNav from './WebNav';
import MobileToggleMenu from './MobileToggleMenu';
import { getDictionary } from '@/lib/dictionary';
import LanguageSwitcher from './LanguageSwitcher';

const NavBar = async ({ lang }: { lang: Locale }) => {
  const { topnav, mobilenav } = await getDictionary(lang);
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
          <MobileToggleMenu lang={lang} text={mobilenav} />
        </div>
        {/* 웹 - 우측 서칭인풋+프로필 */}
        <div className='hidden md:flex md:items-center md:space-x-4'>
          <Search lang={lang} text={topnav.search} />
          <LanguageSwitcher />
          <WebNav text={topnav} session={session} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
