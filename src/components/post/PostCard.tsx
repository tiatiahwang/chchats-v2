import { Icons } from '../Icons';

const PostCard = () => {
  return (
    <li>
      <div className='rounded-md bg-shite shadow'>
        <div className='px-6 py-4 flex justify-between'>
          <div className='w-0 flex-1'>
            {/* 상단 부분 */}
            <div className='max-h-40 flex items-center justify-between text-xs'>
              {/* 카테고리/닉네임/글작성시간 */}
              <div className='text-gray-500'>
                <a
                  className='text-[10px] bg-main p-1 rounded-sm text-white'
                  href='/'
                >
                  <span>고민상담</span>
                </a>
                <span className='pl-2'>티아티아</span>
                <span className='px-1'>•</span>
                2일 전
              </div>
              {/* 댓글 */}
              <div className='w-fit flex items-center justify-end gap-1'>
                <Icons.comment className='h-3 w-3' />0
              </div>
            </div>
            {/* 글 제목 */}
            <a href='/'>
              <h1 className='text-lg font-semibold pb-2 pt-4 leading-6 text-gray-900'>
                글 제목이 여기다
              </h1>
            </a>
            {/* 글 내용 */}
            <div className='relative text-sm max-h-40 w-full overflow-clip'>
              안녕하세요 반가워요 고민이 있어요...
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PostCard;
