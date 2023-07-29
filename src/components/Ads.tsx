const Ads = () => {
  return (
    <div className='hidden md:flex md:flex-col shrink-0'>
      <div className='sticky top-16 space-y-2'>
        <div className='w-[150px] h-[200px] border rounded-md flex justify-center'>
          <span className='p-2 text-xs text-gray-400'>
            광고1
          </span>
        </div>
        <div className='w-[150px] h-[200px] border rounded-md flex justify-center'>
          <span className='p-2 text-xs text-gray-400'>
            광고2
          </span>
        </div>
        <div className='w-[150px] h-[200px] border rounded-md flex justify-center'>
          <span className='p-2 text-xs text-gray-400'>
            광고3
          </span>
        </div>
        <div className='w-[150px] h-[200px] border rounded-md flex justify-center'>
          <span className='p-2 text-xs text-gray-400'>
            광고4
          </span>
        </div>
      </div>
    </div>
  );
};

export default Ads;
