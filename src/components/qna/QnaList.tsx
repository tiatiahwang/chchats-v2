'use client';

import { useCustomToast } from '@/hooks/use-custom-toast';
import { ExtendedCategory } from '@/types/db';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QnaListProps {
  currentCategory: ExtendedCategory;
}

const QnaList = ({ currentCategory }: QnaListProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { loginToast } = useCustomToast();

  return (
    <>
      <div>
        <ul className='flex items-center space-x-2 overflow-x-scroll scrollbar-hide py-2'>
          <li className='p-2 rounded-md cursor-pointer inline whitespace-nowrap bg-gray-200'>
            전체
          </li>
          {currentCategory.subcategories?.map(
            (category) => (
              <Link href={category.url} key={category.id}>
                <li className='p-2 rounded-md cursor-pointer inline whitespace-nowrap'>
                  {category.name}
                </li>
              </Link>
            ),
          )}
        </ul>
      </div>
      <div className='flex items-center justify-end'>
        <div
          className='p-2 rounded-md bg-main hover:bg-mainDark text-white mb-2 cursor-pointer'
          onClick={() => {
            if (!session?.user) {
              return loginToast();
            }

            //   if (currentCategory) {
            //     router.push(`${currentCategory?.url}/create`);
            //   } else {
            //     router.push(
            //       `${currentSubcategory?.url}/create`,
            //     );
            //   }
          }}
        >
          질문하기
        </div>
      </div>
    </>
  );
};

export default QnaList;
