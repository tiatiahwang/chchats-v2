'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';
import { Category, Subcategory } from '@prisma/client';

interface category extends Category {
  subcategories: Subcategory[];
}

interface WebSideBarProps {
  lang: string;
  categories: category[];
}

const WebSideBar: FC<WebSideBarProps> = ({
  lang,
  categories,
}) => {
  const router = useRouter();
  const [onHoverIndex, setOnHoverIndex] =
    useState<number>();
  const onHover = (index: number) => setOnHoverIndex(index);
  const onLeave = () => setOnHoverIndex(0);

  return (
    <div className='hidden md:flex md:flex-col cursor-pointer shrink-0 text-sm'>
      <div className='sticky top-16 space-y-2'>
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              className='flex flex-col w-[150px] rounded-lg h-fit border'
            >
              <div
                className={`font-bold bg-main text-white py-2 px-4 hover:bg-mainDark ${
                  category.id === 5 || category.id === 2
                    ? 'rounded-lg'
                    : 'rounded-t-lg'
                }`}
                onMouseEnter={() => onHover(category.id)}
                onMouseLeave={() => onLeave()}
                role='button'
              >
                <div
                  className='flex justify-between items-center relative cursor-pointer'
                  onClick={() => {
                    router.refresh();
                    if (category.id === 5) {
                      return router.push('/notice/all');
                    }
                    router.push(`${category.url}`);
                  }}
                >
                  <span>
                    {lang === 'en'
                      ? category.eng
                      : category.name}
                  </span>
                  {onHoverIndex === category.id && (
                    <Icons.chevRight className='h-4 w-4 absolute -right-2' />
                  )}
                </div>
              </div>
              <div>
                {category.id !== 5 &&
                  category.id !== 2 &&
                  category?.subcategories.map(
                    (subcategory) => (
                      <div
                        key={subcategory.id}
                        onClick={() => {
                          router.refresh();
                          router.push(`${subcategory.url}`);
                        }}
                      >
                        <div className='px-4 hover:bg-mainLight py-2'>
                          {lang === 'en'
                            ? subcategory.eng
                            : subcategory.name}
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WebSideBar;
