'use client';

import { ExtendedCategory } from '@/types/db';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  PostCreateRequest,
  PostValidator,
} from '@/lib/validator/post';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TipTapEditor from './Editor';
import { toast } from 'react-toastify';
import Placeholder from '@tiptap/extension-placeholder';
import '@/styles/tiptap.css';

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
  const [contentError, setContentError] = useState('');

  const handleOnChangeContent = ({ editor }: any) => {
    if (!(editor as Editor).isEmpty) setContentError('');
    setContent((editor as Editor).getHTML());
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: '여기에 내용을 입력해 주세요.',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    onUpdate: handleOnChangeContent,
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm xl:prose-2xl leading-8 focus:outline-none w-full max-w-full',
      },
      // @ts-ignore
      handleDrop: async (view, event, slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          // TODO: 여러장의 사진을 드랍하는 경우
          // 사진이 1개 일 경우
          if (event.dataTransfer.files.length === 1) {
            let file = event.dataTransfer.files[0];
            let fileSize = (
              file.size /
              1024 /
              1024
            ).toFixed(4);
            // TODO: file.type 안 맞는 경우 안내 토스트
            if (
              (file.type === 'image/jpeg' ||
                file.type === 'image/png') &&
              +fileSize < 10
            ) {
              // 10MB 이하 사진만 업로드 가능하게

              try {
                const {
                  data: { uploadURL },
                } = await axios.post('/api/files');
                const image = new FormData();
                image.append(
                  'file',
                  file,
                  new Date().toJSON().slice(0, 10) +
                    Math.random() * 100,
                );
                const {
                  data: {
                    result: { variants },
                  },
                } = await axios.post(uploadURL, image);
                console.log(variants);
                const url =
                  variants[0]
                    .split('/')
                    .slice(0, 5)
                    .join('/') + '/public';

                const { schema } = view.state;
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                const node = schema.nodes.image.create({
                  src: url,
                }); // creates the image element
                const transaction = view.state.tr.insert(
                  coordinates?.pos!,
                  node,
                ); // places it in the correct position
                return view.dispatch(transaction);
              } catch (error) {
                console.log(error);
                // TODO: error handling
              }
            }
          }
          return true;
        }
        return false;
      },
    },
  });

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
    onSuccess: (url) => {
      router.push(`${url}`);
    },
  });

  const handleSubmit = () => {
    if (!selectedSubcategory)
      return toast.warning(
        '서브 카테고리를 하나 선택해주세요.',
        {
          theme: 'light',
          className: 'text-sm',
        },
      );
    if (title.length < 2 || title.length > 20) {
      return toast.warning(
        '제목은 2~50 글자 사이로 적어주세요.',
        {
          theme: 'light',
          className: 'text-sm',
        },
      );
    }
    if (content === '') {
      return toast.warning('내용을 입력해주세요.', {
        theme: 'light',
        className: 'text-sm',
      });
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
      <input
        className='pb-4 w-full resize-none overflow-hidden bg-transparent text-xl md:text-3xl font-bold focus:outline-none'
        id='title'
        type='text'
        placeholder='제목'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TipTapEditor editor={editor} />
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
