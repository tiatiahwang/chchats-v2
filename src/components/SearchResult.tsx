'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect } from 'react';
import PostCard from './post/PostCard';
import Image from 'next/image';
import { ExtendedPostWithUser } from '@/types/db';

const SearchResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');

  const {
    data: results,
    refetch,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!keyword) return [];
      const { data } = await axios.get(
        `/api/search?keyword=${encodeURI(
          encodeURIComponent(keyword),
        )}`,
      );
      return data as ExtendedPostWithUser[];
    },
    queryKey: ['search-keyword'],
    enabled: false,
  });

  useEffect(() => {
    refetch();
    router.refresh();
  }, [keyword, refetch, router]);

  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        {keyword}
        <span className='text-xl md:text-2xl'>
          {' '}
          검색결과
        </span>
      </h1>
      {isFetching ? (
        <Image
          src='/loader.gif'
          alt='loading'
          width={50}
          height={50}
          unoptimized={true}
        />
      ) : results && results?.length > 0 ? (
        <div className='py-2 space-y-2'>
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div>검색결과가 없습니다.</div>
      )}
    </>
  );
};

export default SearchResult;
