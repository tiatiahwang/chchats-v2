'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Icons } from '../Icons';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useCustomToast } from '@/hooks/use-custom-toast';
import Button from '../ui/Button';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EditProfileRequest,
  EditProfileValidator,
} from '@/lib/validator/profile';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import Modal from '../ui/Modal';
import Skeleton from '../ui/Skeleton';

const TODAY = new Date().toJSON().slice(0, 10);

const ProfileEditLoading = () => {
  return (
    <div className='mx-auto max-w-screen-7xl space-y-6 ml-4'>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium md:border-b-[1px] pb-4'>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div className='md:col-span-2 rounded-md'>
          <Skeleton className='w-full h-[450px]' />
        </div>
      </div>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium md:border-b-[1px] pb-4'>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div className='md:col-span-2 rounded-md'>
          <Skeleton className='w-full h-[200px]' />
        </div>
      </div>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium md:border-b-[1px] pb-4'>
          <Skeleton className='w-full h-[40px]' />
        </div>
        <div className='md:col-span-2 rounded-md'>
          <Skeleton className='w-full h-[200px]' />
        </div>
      </div>
    </div>
  );
};

const ProfileEdit = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { loginToast } = useCustomToast();

  const {
    register,
    setError,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<EditProfileRequest>({
    mode: 'onChange',
    resolver: zodResolver(EditProfileValidator),
  });

  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [avatarUploading, setAvatarUploading] =
    useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const avatar = watch('avatar');

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  useEffect(() => {
    if (session?.user?.username)
      setValue('username', session?.user?.username);
    if (session?.user?.image)
      setAvatarPreview(session?.user?.image);
  }, [session, setValue]);

  const { mutate: changeAvatar } = useMutation({
    mutationFn: async ({ avatar }: EditProfileRequest) => {
      const { data } = await axios.post(
        '/api/profile/edit/avatar',
        {
          avatar,
        },
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          loginToast();
        }
        if (error.response?.status === 500) {
          toast.error(error.response.data, {
            className: 'text-sm whitespace-pre-line',
          });
        }
      }
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        setAvatarUploading(false);
        router.refresh();
      }
    },
  });

  const {
    mutate: changeUsername,
    isLoading: isUsernameLoading,
  } = useMutation({
    mutationFn: async ({
      username,
    }: EditProfileRequest) => {
      const { data } = await axios.post(
        '/api/profile/edit/username',
        {
          username,
        },
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          loginToast();
        }
        if (error.response?.status === 400) {
          setError('username', {
            message: error.response.data,
          });
        }
        if (error.response?.status === 500) {
          toast.error(error.response.data, {
            className: 'text-sm whitespace-pre-line',
          });
        }
      }
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        toast.success('닉네임이 변경되었습니다.', {
          className: 'text-sm',
        });
      }
    },
  });

  const {
    mutate: changePassword,
    isLoading: isPasswordLoading,
  } = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: EditProfileRequest) => {
      const { data } = await axios.post(
        '/api/profile/edit/password',
        {
          currentPassword,
          newPassword,
        },
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          loginToast();
        }
        if (error.response?.status === 500) {
          toast.error(error.response.data, {
            className: 'text-sm whitespace-pre-line',
          });
        }
        if (error.response?.status === 400) {
          setErrorMessage(error.response.data);
        }
      }
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        setValue('currentPassword', '');
        setValue('newPassword', '');
        toast.success('비밀번호가 변경되었습니다.', {
          className: 'text-sm',
        });
      }
    },
  });

  const {
    mutate: deleteAccount,
    isLoading: deleteLoading,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        '/api/auth/delete',
      );
      return data;
    },
    onError: () => {
      return toast.error(
        '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
        {
          className: 'text-sm whitespace-pre-line',
        },
      );
    },
    onSuccess: (data) => {
      if (data === 'OK') {
        signOut({
          callbackUrl: '/',
        });
      }
    },
  });

  const onChangeAvatar = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) {
      return toast.error(
        '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
        {
          className: 'text-sm whitespace-pre-line',
        },
      );
    }

    const fileSize = event.target.files[0].size;
    const maxSize = 1024 * 1024 * 5; // 5MB

    if (fileSize > maxSize) {
      return toast.error(
        '5MB 이하의 사진을 선택해주세요.',
        {
          className: 'text-sm',
        },
      );
    }

    try {
      setAvatarUploading(true);
      const {
        data: { uploadURL },
      } = await axios.post('/api/files');
      const form = new FormData();
      form.append(
        'file',
        event.target.files[0],
        `${TODAY}-${nanoid(5)}-${session?.user.id}`,
      );
      const {
        data: {
          result: { variants },
        },
      } = await axios.post(uploadURL, form);

      if (!variants) {
        setAvatarUploading(false);
        return toast.error(
          '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
          {
            className: 'text-sm whitespace-pre-line',
          },
        );
      }

      const url =
        variants[0].split('/').slice(0, 5).join('/') +
        '/avatar';

      setAvatarPreview(url);
      changeAvatar({ avatar: url });
    } catch (error) {
      setAvatarUploading(false);
      if (error instanceof AxiosError) {
        if (error.response?.status === 413) {
          return toast.error(
            '12,000 픽셀 이하인 이미지만 가능합니다.',
            {
              className: 'text-sm',
            },
          );
        }
      }
      return toast.error(
        '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
        {
          className: 'text-sm whitespace-pre-line',
        },
      );
    }
  };

  const onChangeUsername = () => {
    const username = getValues('username');

    if (username === session?.user.username) {
      return setError('username', {
        message: '새로운 닉네임을 입력해주세요',
      });
    }
    if (username === '') {
      return setError('username', {
        message: '닉네임을 입력해주세요.',
      });
    }
    changeUsername({ username });
  };

  const onChangePassword = () => {
    if (errorMessage !== '') setErrorMessage('');
    const currentPassword = getValues('currentPassword');
    const newPassword = getValues('newPassword');

    if (currentPassword === '') {
      setError('currentPassword', {
        message: '현재 비밀번호를 입력해주세요.',
      });
    }
    if (newPassword === '') {
      setError('newPassword', {
        message: '새로운 비밀번호를 입력해주세요.',
      });
    }

    if (currentPassword && newPassword) {
      //TODO: need to fix this
      // 현재 비밀번호와 새로운 비밀번호가 같으면 오류 메세지 출력
      if (currentPassword === newPassword) {
        return setErrorMessage(
          '현재 비밀번호와 새로운 비밀번호가 일치합니다. 다시 입력해주세요.',
        );
      }
      changePassword({ currentPassword, newPassword });
    }
  };

  const onClickDeleteAccount = () => setShowModal(true);

  if (!session) {
    return <ProfileEditLoading />;
  }

  return (
    <div className='md:ml-4 md:border p-2 md:p-4 rounded-md'>
      <div className='md:grid md:grid-cols-3 gap-4 sm:space-y-4 md:space-y-0'>
        <div className='md:col-span-1 font-medium md:border-b-[1px] pb-4'>
          계정 정보
        </div>
        <div className='bg-slate-100 md:col-span-2 rounded-md p-6 md:p-8'>
          <div className='flex flex-col'>
            {/* 아바타 변경 */}
            <div className='flex items-center justify-center flex-col mb-6'>
              {avatarUploading ? (
                <div className='relative aspect-square w-20 h-20 rounded-full border'>
                  <span className='w-full h-full flex items-center justify-center text-[10px] text-gray-400'>
                    이미지 업로드중
                  </span>
                </div>
              ) : avatarPreview ? (
                <div className='relative aspect-square w-20 h-20 rounded-full'>
                  <Image
                    fill
                    src={avatarPreview!}
                    alt='user avatar'
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                  />
                </div>
              ) : (
                <div className='w-20 h-20 rounded-full'>
                  <Icons.user className='border-[2px] p-1 rounded-full border-slate-900' />
                </div>
              )}
              <label
                htmlFor='avatar'
                className='text-sm p-2 text-white rounded-md bg-main hover:bg-mainDark cursor-pointer mt-2 w-fit'
              >
                사진 변경
              </label>
              <input
                id='avatar'
                name='avatar'
                type='file'
                accept='image/png, image/jpeg, image/jpg'
                className='sr-only'
                onChange={(event) => onChangeAvatar(event)}
              />
            </div>
            {/* 이메일 인증 */}
            <div className='py-4'>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-5 text-gray-700'
              >
                이메일
                <span className='text-[10px] ml-1'>
                  (변경불가)
                </span>
              </label>
              <div className='flex flex-col md:flex-row md:justify-between'>
                <div className='md:w-[85%]'>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    className='w-full bg-transparent border-b py-2 px-4 mt-1 outline-none focus:border-main'
                    defaultValue={session?.user?.email!}
                    disabled={true}
                  />
                </div>
                {/* 구글 로그인한 유저에게만 보이는 문구 */}
                {session?.user?.provider === 'GOOGLE' && (
                  <div className='flex justify-end items-center sm:w-full md:w-fit'>
                    <div className='bg-gray-300 text-white p-2 rounded-md text-sm cursor-default'>
                      인증완료
                    </div>
                  </div>
                )}
                {/* 일반 로그인 한 경우 이메일 인증 버튼 출력 */}
                {/* TODO: 이메일 인증 로직 필요 */}
                {session?.user?.emailVerified === false &&
                  session?.user?.provider ===
                    'CREDENTIALS' && (
                    <div className='flex justify-end items-center sm:w-full md:w-fit'>
                      <Button
                        type='base'
                        disabled={false}
                        isLoading={false}
                        width='w-fit'
                        className='mt-2'
                        text='인증하기'
                      />
                    </div>
                  )}
              </div>
            </div>
            {/* 닉네임 변경 */}
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium leading-5 text-gray-700'
              >
                닉네임
              </label>
              <div className='flex flex-col md:flex-row md:justify-between'>
                <div className='md:w-[85%]'>
                  <input
                    {...register('username')}
                    type='text'
                    id='username'
                    name='username'
                    className={`block flex-1 w-full bg-transparent border-b py-2 px-4 mt-1 outline-none ${
                      errors?.username
                        ? 'focus:border-red-500'
                        : 'focus:border-main '
                    }`}
                    aria-invalid={Boolean(errors.username)}
                  />
                  {errors?.username?.message && (
                    <span className='text-red-500 text-xs leading-8'>
                      {errors.username.message}
                    </span>
                  )}
                </div>
                <div className='flex justify-end items-center sm:w-full md:w-fit'>
                  <Button
                    type='base'
                    disabled={
                      isUsernameLoading ||
                      Boolean(errors.username)
                    }
                    isLoading={isUsernameLoading}
                    width='w-fit'
                    className='mt-2 jutstify-end'
                    text='변경하기'
                    onClick={onChangeUsername}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 일반 로그인 한 경우, 비밀번호 변경 내용 출력 */}
        {session?.user?.provider === 'CREDENTIALS' ? (
          <>
            <div className='md:col-span-1 font-medium md:border-b-[1px] py-4 md:py-0'>
              비밀번호 변경
            </div>
            <div className='bg-slate-100 md:col-span-2 rounded-md p-6 md:p-8'>
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='currentPassword'
                    className='block text-sm font-medium leading-5 text-gray-700'
                  >
                    현재 비밀번호
                  </label>
                  <div className='flex items-center border-b'>
                    <input
                      {...register('currentPassword')}
                      type={
                        showCurrentPassword
                          ? 'text'
                          : 'password'
                      }
                      id='currentPassword'
                      name='currentPassword'
                      className={`w-full bg-transparent py-2 px-4 mt-1 outline-none ${
                        errors?.currentPassword
                          ? 'focus:border-red-500'
                          : 'focus:border-main '
                      }`}
                      aria-invalid={Boolean(
                        errors.currentPassword,
                      )}
                    />
                    {showCurrentPassword ? (
                      <Icons.eye
                        className='w-4 h-4 text-gray-400 cursor-pointer'
                        onClick={() =>
                          setShowCurrentPassword(
                            (prev) => !prev,
                          )
                        }
                      />
                    ) : (
                      <Icons.eyeSlash
                        className='w-4 h-4 text-gray-400 cursor-pointer'
                        onClick={() =>
                          setShowCurrentPassword(
                            (prev) => !prev,
                          )
                        }
                      />
                    )}
                  </div>

                  {errors?.currentPassword?.message && (
                    <span className='text-red-500 text-xs leading-8'>
                      {errors.currentPassword.message}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='newPassword'
                    className='block text-sm font-medium leading-5 text-gray-700'
                  >
                    새로운 비밀번호
                  </label>
                  <div className='flex items-center border-b'>
                    <input
                      {...register('newPassword')}
                      type={
                        showNewPassword
                          ? 'text'
                          : 'password'
                      }
                      id='newPassword'
                      name='newPassword'
                      className={`w-full bg-transparent py-2 px-4 mt-1 outline-none ${
                        errors?.newPassword
                          ? 'focus:border-red-500'
                          : 'focus:border-main '
                      }`}
                    />
                    {showNewPassword ? (
                      <Icons.eye
                        className='w-4 h-4 text-gray-400 cursor-pointer'
                        onClick={() =>
                          setShowNewPassword(
                            (prev) => !prev,
                          )
                        }
                      />
                    ) : (
                      <Icons.eyeSlash
                        className='w-4 h-4 text-gray-400 cursor-pointer'
                        onClick={() =>
                          setShowNewPassword(
                            (prev) => !prev,
                          )
                        }
                      />
                    )}
                  </div>
                  {errors?.newPassword?.message && (
                    <span className='text-red-500 text-xs leading-8'>
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>
              </div>
              {errorMessage && (
                <div className='text-red-500 text-xs flex space-x-1 justify-center items-center font-bold pt-4 pb-2'>
                  <Icons.exclamation className='h-4 w-4 text-red-500' />
                  <span>{errorMessage}</span>
                </div>
              )}
              <div className='flex justify-end items-center w-full'>
                <Button
                  type='base'
                  disabled={
                    isPasswordLoading ||
                    Boolean(errors.currentPassword) ||
                    Boolean(errors.newPassword)
                  }
                  isLoading={isPasswordLoading}
                  width='w-fit'
                  className='mt-2'
                  text='변경하기'
                  onClick={onChangePassword}
                />
              </div>
            </div>
          </>
        ) : null}
        {/* 회원 탈퇴 */}
        <div className='md:col-span-1 font-medium py-4 md:py-0'>
          회원 탈퇴
        </div>
        <div className='bg-slate-100 md:col-span-2 rounded-md p-6 md:p-8 space-y-6'>
          {/* TODO: 문구 변경 필요 */}
          <div className='text-gray-400 text-xs md:text-sm border font-medium rounded-md p-2'>
            회원 탈퇴 후, 계정 복구는 불가능 합니다.
            <br />
            작성한 게시물과 댓글은 삭제되지 않고 익명으로
            처리되며,
            <br />
            CHCHATS으로 소유권이 귀속됩니다.
          </div>
          <div className='md:flex md:items-center md:justify-between'>
            <div className='text-sm space-x-2 flex items-center'>
              <input
                type='checkbox'
                id='delete-account'
                name='delete-account'
                defaultChecked={isChecked}
                onClick={() => setIsChecked(!isChecked)}
              />
              <label htmlFor='delete-account'>
                해당 사항을 숙지하였으며, 동의합니다.
              </label>
            </div>
            <div className='flex justify-end items-center sm:w-full md:w-fit'>
              <button
                onClick={onClickDeleteAccount}
                disabled={!isChecked}
                className={`w-fit text-white p-2 mt-2 rounded-md text-sm ${
                  isChecked
                    ? 'bg-red-500 cursor-pointer hover:bg-red-600'
                    : 'bg-gray-300'
                }`}
              >
                회원 탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          text='정말 탈퇴하시겠어요?'
          open={showModal}
          onClose={() => setShowModal(false)}
          buttonText='확인'
          isLoading={deleteLoading}
          className='bg-red-400 hover:bg-red-500 px-4'
          handleButton={() => deleteAccount()}
        />
      )}
    </div>
  );
};

export default ProfileEdit;
