'use client';

import { ExtendedCategory } from '@/types/db';
import Editor from './Editor';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  PostCreateRequest,
  PostValidator,
} from '@/lib/validator/post';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface NewpostProps {
  categories: ExtendedCategory[];
  currentCategory: ExtendedCategory;
}

const NewPost = ({
  categories,
  currentCategory,
}: NewpostProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState(currentCategory);
  const [selectedSubcategory, setSelectedsubcategory] =
    useState(0);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      categoryId,
      subcategoryId,
    }: PostCreateRequest) => {
      const payload: PostCreateRequest = {
        title,
        content,
        categoryId,
        subcategoryId,
      };
      const { data } = await axios.post(
        '/api/posts/create',
        payload,
      );
      return data;
    },
    onSuccess: ({ postId, category, subcategory }) => {
      router.push(`/${category}/${subcategory}/${postId}`);
    },
  });

  const handleSubmit = () => {
    if (!selectedSubcategory)
      // TODO: 바꾸기
      return alert('서브 카테고리를 하나 선택해주세요.');
    if (title.length < 2 || title.length > 20) {
      return alert('제목은 2~50 글자 사이로 적어주세요.');
    }
    if (content === '') {
      return alert('내용을 입력해주세요.');
    }
    createPost({
      title,
      content,
      categoryId: selectedCategory.id,
      subcategoryId: selectedSubcategory,
    });
  };

  return (
    <>
      <div className='py-4 space-y-2'>
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
                        selectedSubcategory ===
                        subcategory.id
                          ? 'bg-main text-white'
                          : 'bg-gray-100'
                      } p-2 rounded-md cursor-pointer inline whitespace-nowrap`}
                      onClick={() =>
                        setSelectedsubcategory(
                          subcategory.id,
                        )
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
      <Editor
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
      />
      <button
        type='submit'
        className='my-4 p-2 text-md bg-main rounded-md text-white hover:bg-mainDark'
        onClick={handleSubmit}
      >
        작성하기
      </button>
    </>
  );
};

export default NewPost;
