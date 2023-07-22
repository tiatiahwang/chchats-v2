'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import dynamic from 'next/dynamic';
import '@/styles/quill.css';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
  },
) as typeof ReactQuill;

interface EditorProps {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

const Editor = ({
  title,
  setTitle,
  content,
  setContent,
}: EditorProps) => {
  const quillRef = useRef();
  const [isMounted, setIsMounted] = useState<boolean>();
  const [error, setError] = useState('');

  const router = useRouter();

  // const postMutation = useMutation({
  //   mutationFn: async (data: {
  //     title: string;
  //     content: string;
  //   }) => {
  //     await axios.post('/api/post/create', data);
  //   },
  //   onSuccess: () => {},
  // });

  Quill.register('modules/imageResize', ImageResize);

  // 이미지 업로드 관련 로직
  const imageHandler = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*'); // 이미지 파일만 선택가능하도록 제한
    input.click();

    input.onchange = async () => {
      // @ts-ignore
      const file = input.files[0];
      if (file === null) return;

      // @ts-ignore
      const quill = quillRef?.current?.getEditor();
      const range = quill.getSelection(true);

      quill.insertEmbed(
        range.index,
        'image',
        `/loader.gif`,
      );
      const formData = new FormData();
      formData.append('image', file); // formData는 키-밸류 구조

      try {
        const {
          data: { uploadURL },
        } = await axios.post('/api/files');
        const form = new FormData();
        form.append(
          'file',
          file,
          new Date().toJSON().slice(0, 10) +
            Math.random() * 100,
        );
        const {
          data: {
            result: { variants },
          },
        } = await axios.post(uploadURL, form);

        const url =
          variants[0].split('/').slice(0, 5).join('/') +
          '/public';

        // 정상적으로 업로드 됐다면 로딩 gif 삭제
        quill.deleteText(range.index, 1);
        quill.insertEmbed(range.index ?? 1, 'image', url);
      } catch (error) {
        console.log('이미지 업로드 에러!: ', error);
        alert(
          '알 수 없는 오류가 발생했습니다. 잠시 후 시도해주세요.',
        );
        quill.deleteText(range.index, 1);
      }
    };
  }, [quillRef]);

  // editor toolbar 설정
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [false, 3, 2, 1] }],
          [{ color: [] }],
          [
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
          ],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['image'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }),
    [imageHandler],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  if (!isMounted) return;
  return (
    <>
      <input
        className='border-b pb-4 w-full resize-none overflow-hidden bg-transparent text-xl md:text-3xl font-bold focus:outline-none'
        id='title'
        type='text'
        placeholder='제목'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className='py-4'>
        <QuillNoSSRWrapper
          // @ts-ignore
          forwardedRef={quillRef}
          theme='snow'
          className='w-full'
          value={content}
          onChange={setContent}
          modules={modules}
        />
      </div>
    </>
  );
};

export default Editor;
