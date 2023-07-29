import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='w-full h-[84vh] flex flex-col items-center justify-center'>
      <h3 className='text-base md:text-lg text-main font-medium'>
        404
      </h3>
      <h1 className='text-3xl md:text-5xl font-bold py-6 md:py-8'>
        페이지를 찾을 수 없습니다.
      </h1>
      <p className='text-base md:text-lg text-gray-400 text-medium text-center'>
        원하시는 결과를 찾을 수 없습니다. <br />
        올바른 URL을 입력했는지 확인해 주세요.
      </p>
      <Link href='/' className='my-12'>
        <div className='py-2 px-4 text-main border border-main rounded-md w-fit hover:bg-main hover:text-white'>
          메인으로 돌아가기
        </div>
      </Link>
    </div>
  );
}
