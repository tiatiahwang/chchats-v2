import ProfileEdit from '@/components/profile/ProfileEdit';
import Skeleton from '@/components/ui/Skeleton';
import { Suspense } from 'react';

export const ProfileEditLoading = () => {
  return (
    <div className='mx-auto max-w-screen-7xl space-y-6'>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium md:border-b-[1px] pb-4'>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div className='md:col-span-2 rounded-md'>
          <Skeleton className='w-full h-[450px]' />
        </div>
      </div>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium md:border-b-[1px] pb-4'>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div className='md:col-span-2 rounded-md'>
          <Skeleton className='w-full h-[200px]' />
        </div>
      </div>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium md:border-b-[1px] pb-4'>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div className='md:col-span-2 rounded-md'>
          <Skeleton className='w-full h-[200px]' />
        </div>
      </div>
    </div>
  );
};

const Page = async () => {
  return (
    <Suspense fallback={<ProfileEditLoading />}>
      <ProfileEdit />
    </Suspense>
  );
};

export default Page;
