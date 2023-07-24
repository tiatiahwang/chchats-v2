import { z } from 'zod';

export const CommentValidator = z.object({
  text: z
    .string()
    .min(1, { message: '내용을 입력해주세요' })
    .max(500, {
      message: '최대 500자까지만 가능합니다.',
    }),
  postId: z.string(),
});

export type CommentCreateRequest = z.infer<
  typeof CommentValidator
>;
