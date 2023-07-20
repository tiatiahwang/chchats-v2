'use client';

import { ExtendedCategory } from '@/types/db';
import { useSession } from 'next-auth/react';
import { Dispatch, FC, SetStateAction } from 'react';

interface PostCategoryProps {
  categories: ExtendedCategory[];
  selectedCategory: ExtendedCategory;
  setSelectedCategory: Dispatch<
    SetStateAction<ExtendedCategory>
  >;
  selectedSubcategory: number;
  setSelectedsubcategory: Dispatch<SetStateAction<number>>;
}

const PostCategory: FC<PostCategoryProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedsubcategory,
}) => {
  const { data: session } = useSession();
  return (
    <div className='w-full py-4 space-y-2'>
      <h3 className='text-base'>카테고리 선택</h3>
      <div className='space-y-2 border-y-[1px] py-4'>
        <div className='md:flex md:items-center md:space-x-2 space-y-2 md:space-y-0'>
          <h3>메인 카테고리</h3>
          <ul className='flex items-center overflow-x-scroll scrollbar-hide space-x-2'>
            {categories.map((category) => {
              if (
                category.id === 5 &&
                session?.user?.role === 'USER'
              )
                return;
              return (
                <li
                  key={category.id}
                  className={`${
                    +selectedCategory.id === category.id
                      ? 'bg-main text-white'
                      : 'bg-gray-100'
                  } p-2 rounded-md cursor-pointer inline whitespace-nowrap`}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                >
                  {category.name}
                </li>
              );
            })}
          </ul>
        </div>
        <div className='md:flex md:items-center md:space-x-2'>
          <h3>서브 카테고리</h3>
          <ul className='flex items-center overflow-x-scroll scrollbar-hide space-x-2'>
            {selectedCategory.subcategories.map(
              (subcategory) => {
                return (
                  <li
                    key={subcategory.id}
                    className={`${
                      selectedSubcategory === subcategory.id
                        ? 'bg-main text-white'
                        : 'bg-gray-100'
                    } p-2 rounded-md cursor-pointer inline whitespace-nowrap`}
                    onClick={() =>
                      setSelectedsubcategory(subcategory.id)
                    }
                  >
                    {subcategory.name}
                  </li>
                );
              },
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostCategory;
