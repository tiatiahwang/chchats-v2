import { z } from 'zod';

export const PostValidator = z.object({
  title: z
    .string()
    .min(2, { message: '최소 2글자 이상 입력해 주세요.' })
    .max(100, {
      message: '최대 100글자까지만 가능합니다.',
    }),
  category: z.string(),
  subcategory: z.string(),
  content: z.any(),
});

export type PostCreateRequest = z.infer<
  typeof PostValidator
>;
