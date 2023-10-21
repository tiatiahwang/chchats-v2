'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const redirectedPathname = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <select
      className='text-sm py-2 pl-2 pr-4 border focus:ring-2 focus:outline-none foucs:ring-main rounded-md cursor-pointer'
      onChange={(e: any) => {
        const url = redirectedPathname(e.target.value);
        router.push(url);
      }}
    >
      <option value='en'>en</option>
      <option value='ko'>ko</option>
    </select>
  );
};

export default LanguageSwitcher;
