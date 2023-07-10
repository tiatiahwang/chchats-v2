import { Icons } from './Icons';

const Avatar = ({ user, ...props }) => {
  return (
    <div>
      {user?.image ? (
        <div>LATER</div>
      ) : (
        <Icons.user className='w-8 h-8 border-[1.5px] p-1 rounded-full border-slate-900' />
      )}
    </div>
  );
};

export default Avatar;
