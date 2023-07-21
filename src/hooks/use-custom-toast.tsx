import Link from 'next/link';
import { toast } from 'react-toastify';

const LoginLink = () => (
  <div className='flex justify-between items-center text-sm'>
    <span>로그인이 필요합니다.</span>
    <Link
      href='/login'
      className='py-2 px-4 rounded-md border hover:border-main hover:text-main'
    >
      로그인
    </Link>
  </div>
);

export const useCustomToast = () => {
  const loginToast = () => {
    toast.warning(LoginLink);
  };
  return { loginToast };
};
