const Layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className='flex px-2'>{children}</div>;
};

export default Layout;
