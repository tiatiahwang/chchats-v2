'use client';

import { VoteType } from '@prisma/client';
import { Icons } from '../Icons';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useEffect, useState } from 'react';
import { usePrevious } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { PostVoteRequest } from '@/lib/validator/post';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface PostVoteProps {
  postId: string;
  initialVoteAmount: number;
  initialVote?: VoteType | null;
}

const PostVote = ({
  postId,
  initialVoteAmount,
  initialVote,
}: PostVoteProps) => {
  const { loginToast } = useCustomToast();
  const [votesAmount, setVotesAmount] = useState<number>(
    initialVoteAmount,
  );
  const [currentVote, setCurrentVote] =
    useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };
      await axios.patch('/api/posts/vote', payload);
    },
    onError: (error, voteType) => {
      if (voteType === 'UP')
        setVotesAmount((prev) => prev - 1);
      else setVotesAmount((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (error instanceof AxiosError) {
        if (error?.response?.status === 401) {
          return loginToast();
        }
      }

      return toast.error(
        '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
        {
          theme: 'light',
          className: 'text-sm whitespace-pre-line',
        },
      );
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined);
        if (type === 'UP')
          setVotesAmount((prev) => prev - 1);
        else if (type === 'DOWN')
          setVotesAmount((prev) => prev + 1);
      } else {
        setCurrentVote(type);
        if (type === 'UP')
          setVotesAmount(
            (prev) => prev + (currentVote ? 2 : 1),
          );
        else if (type === 'DOWN')
          setVotesAmount(
            (prev) => prev - (currentVote ? 2 : 1),
          );
      }
    },
  });

  return (
    <div className='mt-4 flex justify-center items-center space-x-3'>
      <button
        onClick={() => {
          if (isLoading) return;
          vote('UP');
        }}
        className={`h-6 w-6 flex items-center justify-center rounded-t-md border  ${
          currentVote === 'UP'
            ? 'text-white bg-main hover:border-main hover:bg-transparent hover:text-main'
            : 'hover:text-main hover:border-main text-gray-400'
        }`}
      >
        <span className='sr-only'>추천</span>
        <Icons.chevUp className='w-4 h-4' />
      </button>
      <span className='text-sm font-medium'>
        {votesAmount}
      </span>
      <button
        onClick={() => {
          if (isLoading) return;
          vote('DOWN');
        }}
        className={`h-6 w-6 flex items-center justify-center rounded-t-md border  ${
          currentVote === 'DOWN'
            ? 'text-white bg-main hover:border-main hover:bg-transparent hover:text-main'
            : 'hover:text-main hover:border-main text-gray-400'
        }`}
      >
        <span className='sr-only'>비추천</span>
        <Icons.chevDown className='w-4 h-4' />
      </button>
    </div>
  );
};

export default PostVote;
