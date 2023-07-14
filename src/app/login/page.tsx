import GoogleLogIn from '@/components/GoogleLogIn';
import LogIn from '@/components/LogIn';
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  return (
    <div className='my-20'>
      <div className='h-full max-w-md w-full mx-auto flex flex-col items-center justify-center'>
        <div className='relative aspect-square h-14 w-14'>
          <Image
            fill
            src='/favicon.ico'
            alt='logo'
            referrerPolicy='no-referrer'
          />
        </div>
        <h1 className='font-bold text-2xl md:text-3xl my-2'>
          Welcome to CHCHATS!
        </h1>
        <p className='text-sm text-gray-600'>
          미주 한인 커뮤니티 사이트 입니다.
        </p>
        <div className='pt-12 w-full'>
          {/* 구글 로그인 */}
          <GoogleLogIn />
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
          <LogIn />
        </div>
        <div className='text-sm mt-8'>
          아직 계정이 없으신가요?{' '}
          <Link
            href='/join'
            className='text-main underline'
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
