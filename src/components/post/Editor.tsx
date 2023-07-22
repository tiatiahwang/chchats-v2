import { Editor, EditorContent } from '@tiptap/react';
import Skeleton from '../ui/Skeleton';

interface TipTapEditorProps {
  editor: Editor | null;
}

const TipTapEditor = ({ editor }: TipTapEditorProps) => {
  if (!editor) {
    return <Skeleton className='w-full h-[450px]' />;
  }
  return (
    <div className='border'>
      <div className='flex justify-between items-center px-4'>
        <div className='flex items-center py-4 space-x-2'>
          <button
            type='button'
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()
            }
            className={
              editor.isActive('heading', { level: 2 })
                ? 'bg-wh-500 text-wh-50 p-1 rounded-md'
                : 'p-1'
            }
          >
            <svg
              className='w-4 h-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM21.0005 8V20H19.0005L19 10.204L17 10.74V8.67L19.5005 8H21.0005Z'></path>
            </svg>
          </button>
          <button
            type='button'
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 3 })
                .run()
            }
            className={
              editor.isActive('heading', { level: 3 })
                ? 'bg-wh-500 text-wh-50 p-1 rounded-md'
                : 'p-1'
            }
          >
            <svg
              className='w-4 h-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5711 8 22.25 9.67893 22.25 11.75C22.25 12.6074 21.9623 13.3976 21.4781 14.0292L21.3302 14.2102L18.0343 18H22V20H15L14.9993 18.444L19.8207 12.8981C20.0881 12.5908 20.25 12.1893 20.25 11.75C20.25 10.7835 19.4665 10 18.5 10C17.5818 10 16.8288 10.7071 16.7558 11.6065L16.75 11.75H14.75C14.75 9.67893 16.4289 8 18.5 8Z'></path>
            </svg>
          </button>
          <button
            type='button'
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            disabled={
              !editor
                .can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={
              editor.isActive('bold')
                ? 'bg-wh-500 text-wh-50 p-1 rounded-md'
                : 'p-1'
            }
          >
            <svg
              className='w-4 h-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z'></path>
            </svg>
          </button>
          <button
            type='button'
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            disabled={
              !editor
                .can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={
              editor.isActive('italic')
                ? 'bg-wh-500 text-wh-50 p-1 rounded-md'
                : 'p-1'
            }
          >
            <svg
              className='w-4 h-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z'></path>
            </svg>
          </button>
          <button
            type='button'
            onClick={() =>
              editor.chain().focus().toggleStrike().run()
            }
            disabled={
              !editor
                .can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            className={
              editor.isActive('strike')
                ? 'bg-wh-500 text-wh-50 p-1 rounded-md'
                : 'p-1'
            }
          >
            <svg
              className='w-4 h-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M17.1538 14C17.3846 14.5161 17.5 15.0893 17.5 15.7196C17.5 17.0625 16.9762 18.1116 15.9286 18.867C14.8809 19.6223 13.4335 20 11.5862 20C9.94674 20 8.32335 19.6185 6.71592 18.8555V16.6009C8.23538 17.4783 9.7908 17.917 11.3822 17.917C13.9333 17.917 15.2128 17.1846 15.2208 15.7196C15.2208 15.0939 15.0049 14.5598 14.5731 14.1173C14.5339 14.0772 14.4939 14.0381 14.4531 14H3V12H21V14H17.1538ZM13.076 11H7.62908C7.4566 10.8433 7.29616 10.6692 7.14776 10.4778C6.71592 9.92084 6.5 9.24559 6.5 8.45207C6.5 7.21602 6.96583 6.165 7.89749 5.299C8.82916 4.43299 10.2706 4 12.2219 4C13.6934 4 15.1009 4.32808 16.4444 4.98426V7.13591C15.2448 6.44921 13.9293 6.10587 12.4978 6.10587C10.0187 6.10587 8.77917 6.88793 8.77917 8.45207C8.77917 8.87172 8.99709 9.23796 9.43293 9.55079C9.86878 9.86362 10.4066 10.1135 11.0463 10.3004C11.6665 10.4816 12.3431 10.7148 13.076 11H13.076Z'></path>
            </svg>
          </button>
          <button>
            <svg
              className='w-4 h-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M5 11.1005L7 9.1005L12.5 14.6005L16 11.1005L19 14.1005V5H5V11.1005ZM5 13.9289V19H8.1005L11.0858 16.0147L7 11.9289L5 13.9289ZM10.9289 19H19V16.9289L16 13.9289L10.9289 19ZM4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM15.5 10C14.6716 10 14 9.32843 14 8.5C14 7.67157 14.6716 7 15.5 7C16.3284 7 17 7.67157 17 8.5C17 9.32843 16.3284 10 15.5 10Z'></path>
            </svg>
          </button>
        </div>
      </div>
      <div className='border-b ' />
      <EditorContent
        editor={editor}
        className='p-4 h-[400px] overflow-auto'
      />
    </div>
  );
};

export default TipTapEditor;
