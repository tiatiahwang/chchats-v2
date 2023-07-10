import Card from '@/components/Card';
import WebSideBar from '@/components/WebSideBar';

export default function Home() {
  return (
    <div className='flex text-sm px-2 pb-2'>
      <WebSideBar />
      <div className='grid grid-cols-1 md:grid-cols-2 md:ml-4 w-full gap-4'>
        <Card category='자유게시판' />
        <Card category='묻고답하기' />
        <Card category='온라인마켓' />
        <Card category='지역소모임' />
        <Card category='공지사항' />
      </div>
    </div>
  );
}
