const Layout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex text-sm px-2 pb-2'>
      <div className='border rounded-md w-full p-4'>
        <h1 className='font-bold text-2xl md:text-4xl h-14'>
          새로운 글 작성하기
        </h1>
        {children}
      </div>
    </div>
  );
};

export default Layout;
