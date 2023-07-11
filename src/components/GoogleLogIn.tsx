import { Icons } from './Icons';

const GoogleLogIn = () => {
  return (
    <div className='text-sm mx-auto flex justify-center items-center space-x-2 py-2 px-4 border-[1px] rounded-lg cursor-pointer hover:border-main'>
      <Icons.google className='w-4 h-4' />
      <span>Google 계정으로 로그인</span>
    </div>
  );
};

export default GoogleLogIn;
