'use client';

import { Editor, EditorContent } from '@tiptap/react';
import Skeleton from '../ui/Skeleton';
import { ChangeEvent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Image from 'next/image';
import { EditorIcons } from '../Icons';
import { nanoid } from 'nanoid';

interface TipTapEditorProps {
  editor: Editor | null;
}

const TODAY = new Date().toJSON().slice(0, 10);

const TipTapEditor = ({ editor }: TipTapEditorProps) => {
  const [link, setLink] = useState<string>('');
  const [linkModal, setLinkModal] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] =
    useState<boolean>(false);
  const [imageModal, setImageModal] =
    useState<boolean>(false);

  const handleLinkModal = () => {
    if (imageModal) setImageModal(false);
    setLinkModal(!linkModal);
  };

  const handleImageModal = () => {
    if (linkModal) setLinkModal(false);
    setImageModal(!imageModal);
  };

  const handleLink = useCallback(() => {
    if (!link) {
      return toast.warning('url를 입력해주세요.', {
        className: 'text-sm',
      });
    }

    const href = !link.startsWith('https://' || 'http://')
      ? `https://${link}`
      : link;

    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href, target: '_blank' })
      .run();

    setLinkModal(false);
    setLink('');
  }, [editor, link]);

  const handleImage = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event?.target?.files?.[0]) {
        return toast.warning(
          '이미지 업로드 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
          {
            className: 'text-sm whitespace-pre-line',
          },
        );
      }

      try {
        setIsUploading(true);
        const file = event.target.files[0];
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
          variants[0].split('/').slice(0, 5).join('/') +
          '/public';

        editor?.chain().setImage({ src: url }).run();
      } catch (error) {
        toast.warning(
          '이미지 업로드 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
          {
            className: 'text-sm whitespace-pre-line',
          },
        );
      } finally {
        setIsUploading(false);
        setImageModal(false);
      }
    },
    [editor],
  );

  const toggleHeadingOne = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .toggleHeading({ level: 2 })
      .run();
  }, [editor]);

  const toggleHeadingTwo = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .toggleHeading({ level: 3 })
      .run();
  }, [editor]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  if (!editor) {
    return <Skeleton className='w-full h-[450px]' />;
  }

  return (
    <div className='border'>
      {/* 에디터 툴바 */}
      <div className='flex justify-between items-center px-4'>
        <div className='flex items-center h-10 space-x-2'>
          {/* h1 */}
          <button
            type='button'
            onClick={toggleHeadingOne}
            className={
              editor.isActive('heading', { level: 2 })
                ? 'bg-main fill-white p-2 rounded-md'
                : 'p-2 hover:bg-main hover:rounded-md hover:fill-white'
            }
          >
            <EditorIcons.headingOne className='w-4 h-4' />
          </button>
          {/* h2 */}
          <button
            type='button'
            onClick={toggleHeadingTwo}
            className={
              editor.isActive('heading', { level: 3 })
                ? 'bg-main fill-white p-2 rounded-md'
                : 'p-2 hover:bg-main hover:rounded-md hover:fill-white'
            }
          >
            <EditorIcons.headingTwo className='w-4 h-4' />
          </button>
          {/* bold */}
          <button
            type='button'
            onClick={toggleBold}
            className={
              editor.isActive('bold')
                ? 'bg-main fill-white p-2 rounded-md cursor-pointer'
                : 'p-2 hover:bg-main hover:rounded-md hover:fill-white cursor-pointer'
            }
          >
            <EditorIcons.bold className='w-4 h-4' />
          </button>
          {/* italic */}
          <button
            type='button'
            onClick={toggleItalic}
            className={
              editor.isActive('italic')
                ? 'bg-main fill-white p-2 rounded-md cursor-pointer'
                : 'p-2 hover:bg-main hover:rounded-md hover:fill-white cursor-pointer'
            }
          >
            <EditorIcons.italic className='w-4 h-4' />
          </button>
          {/* strike */}
          <button
            type='button'
            onClick={toggleStrike}
            className={
              editor.isActive('strike')
                ? 'bg-main fill-white p-2 rounded-md cursor-pointer'
                : 'p-2 hover:bg-main hover:rounded-md hover:fill-white cursor-pointer'
            }
          >
            <EditorIcons.strike className='w-4 h-4' />
          </button>
          {/* link */}
          <button
            onClick={handleLinkModal}
            className={`cursor-pointer p-2 hover:bg-main hover:rounded-md hover:fill-white ${
              linkModal
                ? 'bg-main fill-white rounded-md'
                : ''
            }`}
          >
            <EditorIcons.link className='w-4 h-4' />
          </button>
          {/* image */}
          <div className='relative'>
            <div
              onClick={handleImageModal}
              className={`cursor-pointer p-2 hover:bg-main hover:rounded-md hover:fill-white ${
                imageModal
                  ? 'bg-main fill-white rounded-md'
                  : ''
              }`}
            >
              <EditorIcons.image className='w-4 h-4' />
            </div>
            {linkModal && (
              <div className='absolute top-[34px] -right-4 md:-left-10 border shadow-md bg-white rounded-md p-4 w-[300px] md:w-[380px] z-10'>
                <div className='space-y-1'>
                  <span className='text-[10px] md:text-xs'>
                    * 링크로 만들 텍스트틀 선택하신 후에,
                    링크를 입력해주세요.
                  </span>
                  <input
                    className='text-xs md:text-base w-full border rounded-md p-2 outline-none'
                    autoFocus
                    value={link}
                    onChange={(e) =>
                      setLink(e.target.value)
                    }
                  />
                </div>
                <div className='justify-end flex mt-2 space-x-2'>
                  <span
                    onClick={handleLinkModal}
                    className='text-xs md:text-base bg-gray-300 text-white p-2 rounded-md hover:bg-gray-400 cursor-pointer'
                  >
                    취소
                  </span>
                  <span
                    onClick={handleLink}
                    className='text-xs md:text-base bg-main text-white p-2 rounded-md hover:bg-mainDark cursor-pointer'
                  >
                    저장
                  </span>
                </div>
              </div>
            )}
            {imageModal && (
              <div className='absolute top-[34px] -right-4 md:left-0 border shadow-md bg-white rounded-md p-4 w-[300px] md:w-[380px] z-10'>
                {isUploading ? (
                  <div className='w-full h-full flex flex-col items-center justify-center space-y-2'>
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
                ) : (
                  <>
                    <div className='w-full space-y-2'>
                      <p className='text-[10px] md:text-xs '>
                        * 여러장 업로드는 텍스트 입력 창에
                        직접 드래그앤 드롭해주세요.
                      </p>
                      <p className='text-[10px] md:text-xs pb-2'>
                        * 파일 선택은 1장만 가능합니다.
                      </p>
                      <input
                        className='text-xs md:text-base file:bg-mainLight file:text-main file:rounded-md file:rounded-tr-none file:rounded-br-none file:px-4 file:py-2 file:mr-4 file:border-none file:cursor-pointer hover:cursor-pointer border rounded-lg text-gray-400'
                        type='file'
                        onChange={handleImage}
                        accept='image/png, image/jpeg, image/jpg'
                      />
                    </div>
                    <div className='justify-end flex'>
                      <span
                        onClick={handleImageModal}
                        className='text-xs md:text-base mt-2 mr-2 bg-gray-300 text-white p-2 rounded-md hover:bg-gray-400 cursor-pointer'
                      >
                        취소
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='border-b ' />
      {/* 에디터 본문 입력  */}
      <EditorContent
        onClick={() => editor.chain().focus()}
        editor={editor}
        className='p-4 h-[400px] overflow-auto'
      />
    </div>
  );
};

export default TipTapEditor;
