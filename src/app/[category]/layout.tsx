import WebSideBar from '@/components/WebSideBar';

const Layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex text-sm px-2 pb-2'>
      <WebSideBar />
      <div className='w-full px-4'>{children}</div>
    </div>
  );
};

export default Layout;
