import { ThreeDots } from 'react-loader-spinner';

export default function Loader() {
  return (
    // wrapperStyle: Styles to be applied to the wrapper.
    // It should be a valid CSS object.It can be used for custom styling.
    // It will override the default style
    <div className='h-[80vh] w-full flex justify-center items-center'>
      <ThreeDots
        height='100'
        width='100'
        radius='9'
        color='#138808'
        ariaLabel='three-dots-loading'
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  );
}
