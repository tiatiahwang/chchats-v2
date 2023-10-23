import GoogleLogIn from '@/components/auth/GoogleLogIn';
import LogIn from '@/components/auth/LogIn';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import Image from 'next/image';
import Link from 'next/link';

const Page = async ({
  params,
}: {
  params: { lang: Locale };
}) => {
  const lang = params.lang ?? 'en';
  const { auth } = await getDictionary(lang);

  return (
    <div className='my-10 md:my-20 mx-4 md:mx-0'>
      <div className='h-full max-w-sm w-full mx-auto flex flex-col items-center justify-center'>
        <div className='relative aspect-square h-14 w-14'>
          <Image
            fill
            src='/logo_noletter.png'
            alt='logo'
            referrerPolicy='no-referrer'
          />
        </div>
        <h1 className='font-bold text-2xl md:text-3xl my-2'>
          Welcome to CHCHATS!
        </h1>
        <p className='text-sm text-gray-600'>
          {auth.subtitle}
        </p>
        <div className='pt-12 w-full'>
          {/* 구글 로그인 */}
          <GoogleLogIn text={auth.google} />
          <div className='mt-8'>
            <div className='relative'>
              <div className='absolute w-full border-t' />
              <div className='relative -top-3 text-center '>
                <span className='bg-slate-50 px-2 text-sm text-gray-600'>
                  OR
                </span>
              </div>
            </div>
          </div>
          {/* 커스텀 로그인 */}
          <LogIn text={auth.custom} />
        </div>
        <div className='text-sm mt-8'>
          {auth.bottom.loginPage.text}{' '}
          <Link
            href='/join'
            className='text-main underline'
          >
            {auth.bottom.loginPage.link}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
