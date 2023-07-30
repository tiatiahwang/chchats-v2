import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className='mt-20'>
      <footer className='py-10 text-center text-gray-400 text-xs border-t flex flex-col justify-center space-y-4'>
        <div className='w-full flex justify-center'>
          <Link href='/'>
            <Image
              width={100}
              height={50}
              src='/logo_light.png'
              alt='logo'
            />
          </Link>
        </div>
        <div>Copyright @CHCHATS 2023</div>
      </footer>
    </div>
  );
};

export default Footer;
