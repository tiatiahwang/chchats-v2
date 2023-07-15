'use client';

import { FC, useState } from 'react';
import { Icons } from '@/components/Icons';
import { Category, Subcategory } from '@prisma/client';
import Link from 'next/link';

interface category extends Category {
  subcategories: Subcategory[];
}

interface WebSideBarProps {
  categories: category[];
}

const WebSideBar: FC<WebSideBarProps> = ({
  categories,
}) => {
  const [onHoverIndex, setOnHoverIndex] =
    useState<number>();
  const onHover = (index: number) => setOnHoverIndex(index);
  const onLeave = () => setOnHoverIndex(0);

  return (
    <div className='hidden md:flex md:flex-col cursor-pointer shrink-0'>
      <div className='sticky top-16 space-y-2'>
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              className='flex flex-col w-[150px] rounded-lg h-fit border'
            >
              <div
                className='rounded-t-lg font-bold bg-main text-white py-2 px-4 hover:bg-mainDark'
                onMouseEnter={() => onHover(category.id)}
                onMouseLeave={() => onLeave()}
                role='button'
              >
                <Link
                  className='flex justify-between items-center relative'
                  href={{
                    pathname: category.url,
                  }}
                >
                  <span>{category.name}</span>
                  {onHoverIndex === category.id && (
                    <Icons.chevRight className='h-4 w-4 absolute -right-2' />
                  )}
                </Link>
              </div>
              <div>
                {category?.subcategories.map(
                  (subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`${subcategory.url}`}
                    >
                      <div className='px-4 hover:bg-mainLight py-2'>
                        {subcategory.name}
                      </div>
                    </Link>
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
