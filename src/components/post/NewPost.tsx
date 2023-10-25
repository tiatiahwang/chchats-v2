'use client';

import '@/styles/tiptap.css';
import { ExtendedCategory } from '@/types/db';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  PostCreateRequest,
  PostEditRequest,
} from '@/lib/validator/post';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorImage from '@tiptap/extension-image';
import TipTapEditor from './Editor';
import { toast } from 'react-toastify';
import Placeholder from '@tiptap/extension-placeholder';
import { Post, Subcategory } from '@prisma/client';
import Button from '../ui/Button';
import Link from '@tiptap/extension-link';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { CreatePost } from '@/types/dictionary';

interface NewpostProps {
  lang: string;
  text: CreatePost;
  post?: Post;
  categories: ExtendedCategory[];
  currentCategory: ExtendedCategory;
  currentSubcategory?: Subcategory;
}

const TODAY = new Date().toJSON().slice(0, 10);

const NewPost = ({
  lang,
  text,
  post,
  categories,
  currentCategory,
  currentSubcategory,
}: NewpostProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] =
    useState<ExtendedCategory>(currentCategory);
  const [selectedSubcategory, setSelectedsubcategory] =
    useState<number>(currentSubcategory?.id ?? 0);

  const [title, setTitle] = useState<string>(
    post?.title ?? '',
  );
  const [content, setContent] = useState<string>(
    post?.content ?? '',
  );

  // 글이 다 작성이 됬음에도, 페이지 전환이 조금 느려서 로딩 상태 별도로 관리
  const [createLoading, setCreateLoading] =
    useState<boolean>(false);
  const [editLoading, setEditLoading] =
    useState<boolean>(false);

  const [isUploading, setIsUploading] =
    useState<boolean>(false);

  const handleOnChangeContent = ({ editor }: any) => {
    setContent((editor as Editor).getHTML());
  };

  const handleDragImage = () =>
    setIsUploading((prev) => !prev);

  const editor = useEditor({
    extensions: [
      StarterKit,
      EditorImage,
      Placeholder.configure({
        placeholder: text.editor.placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    onUpdate: handleOnChangeContent,
    content: content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm focus:outline-none w-full max-w-full',
      },
      // @ts-ignore
      handleDrop: async (view, event, slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const files = Array.from(
            event.dataTransfer.files,
          );

          const maxSize = 1024 * 1024 * 10; // 10MB

          // file size 확인 - 10MB 이하만 업로드 가능
          const filterFileSize = files.filter(
            (file) => file.size < maxSize,
          );

          // filter한 결과가 없는 경우, 토스트창으로 return
          if (filterFileSize.length === 0) {
            return toast.warning(
              '10MB이하 사진만 가능합니다.',
              { className: 'text-sm' },
            );
          }

          if (files.length !== filterFileSize.length) {
            toast.warning(
              '10MB 이하 사진만 업로드됩니다.',
              { className: 'text-sm' },
            );
          }

          // file type 확인
          const filterFileType = filterFileSize.filter(
            (file) =>
              file.type === 'image/png' ||
              file.type === 'image/jpg' ||
              file.type === 'image/jpeg',
          );

          // filter한 결과가 없는 경우, 토스트창으로 return
          if (filterFileType.length === 0) {
            return toast.warning(
              'png/jpeg/jpg 사진만 가능합니다.',
              { className: 'text-sm' },
            );
          }

          if (
            filterFileSize.length !== filterFileType.length
          ) {
            toast.warning(
              'png/jpeg/jpg 사진만 업로드됩니다.',
              { className: 'text-sm' },
            );
          }

          handleDragImage();
          try {
            filterFileType.forEach(async (file, index) => {
              const {
                data: { uploadURL },
              } = await axios.post('/api/files');
              const image = new FormData();
              image.append(
                'file',
                file,
                `${TODAY}-${nanoid(10)}`,
              );
              const {
                data: {
                  result: { variants },
                },
              } = await axios.post(uploadURL, image);

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

              // 이미지 파일이 마지막인 경우, isUploading 상태 변경 위한 조건
              if (index === files.length - 1) {
                handleDragImage();
              }
              return view.dispatch(transaction);
            });
          } catch (error) {
            return toast.error(
              '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
              {
                className: 'text-sm whitespace-pre-line',
              },
            );
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
      setCreateLoading(true);
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
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          toast.error(error.response.data, {
            className: 'text-sm whitespace-pre-line',
          });
        }
      }
    },
    onSuccess: (url) => {
      router.refresh();
      router.push(`${url}`);
    },
  });

  const { mutate: editPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      categoryId,
      subcategoryId,
      postId,
    }: PostEditRequest) => {
      setEditLoading(true);
      const payload: PostEditRequest = {
        title,
        content,
        categoryId,
        subcategoryId,
        postId,
      };
      const { data } = await axios.post(
        '/api/posts/edit',
        payload,
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          toast.error(error.response.data, {
            className: 'text-sm whitespace-pre-line',
          });
        }
      }
    },
    onSuccess: (url) => {
      router.refresh();
      router.push(`${url}`);
    },
  });

  const handleSubmit = () => {
    if (!selectedSubcategory)
      return toast.warning(
        '서브 카테고리를 하나 선택해주세요.',
        {
          className: 'text-sm',
        },
      );
    if (title.length < 2 || title.length > 50) {
      return toast.warning(
        '제목은 2~50 글자 사이로 적어주세요.',
        {
          className: 'text-sm',
        },
      );
    }
    if (content === '') {
      return toast.warning('내용을 입력해주세요.', {
        className: 'text-sm',
      });
    }
    if (pathname.includes('edit')) {
      if (
        title === post?.title &&
        content === post?.content
      ) {
        return toast.warning('수정된 사항이 없습니다.', {
          className: 'text-sm',
        });
      }
      return editPost({
        title,
        content,
        categoryId: selectedCategory.id,
        subcategoryId: selectedSubcategory,
        postId: post?.id,
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
        <h3 className='text-base'>{text.subtitle}</h3>
        <div className='space-y-2 border-y-[1px] py-4'>
          <div className='md:flex md:items-center md:space-x-2 space-y-2 md:space-y-0'>
            <h3>{text.category}</h3>
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
                    {lang === 'en'
                      ? category.eng
                      : category.name}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='md:flex md:items-center md:space-x-2 space-y-2 md:space-y-0'>
            <h3>{text.subcategory}</h3>
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
                      {lang === 'en'
                        ? subcategory.eng
                        : subcategory.name}
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
        placeholder={text.editor.title}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TipTapEditor editor={editor} />
      <Button
        type='base'
        isLoading={createLoading || editLoading}
        text={text.button}
        loadingText={text.loading}
        onClick={handleSubmit}
        width='w-fit'
        className='my-4'
      />
      {isUploading && (
        <div className='fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black/40'>
          <div className='bg-slate-50 rounded-md w-[200px] md:w-[350px] py-10 md:py10 flex flex-col items-center justify-center space-y-2'>
            <Image
              src='/loader.gif'
              alt='loading'
              width={50}
              height={50}
              unoptimized={true}
            />
            <span className='text-xs'>
              이미지 업로드중...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPost;
