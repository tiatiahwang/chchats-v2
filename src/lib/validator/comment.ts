import { literal, z } from 'zod';

export const CommentValidator = z.object({
  text: z.string(),
  postId: z.string(),
  replyToId: z.string().optional(),
});

export const CommentDeleteValidator = z.object({
  commentId: z.string(),
  replyToId: z.string().optional().or(literal(null)),
});

export type CommentCreateRequest = z.infer<
  typeof CommentValidator
>;

export type CommentDeleteRequest = z.infer<
  typeof CommentDeleteValidator
>;
