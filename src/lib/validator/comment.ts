import { literal, z } from 'zod';

export const CommentCreateValidator = z.object({
  text: z.string(),
  postId: z.string(),
  replyToId: z.string().optional().or(literal(null)),
});

export const CommentEditValidator = z.object({
  text: z.string(),
  commentId: z.string(),
});

export const CommentDeleteValidator = z.object({
  commentId: z.string(),
  replyToId: z.string().optional().or(literal(null)),
});

export type CommentCreateRequest = z.infer<
  typeof CommentCreateValidator
>;

export type CommentEditRequest = z.infer<
  typeof CommentEditValidator
>;

export type CommentDeleteRequest = z.infer<
  typeof CommentDeleteValidator
>;
