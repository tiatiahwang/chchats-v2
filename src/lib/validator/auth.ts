import { z } from 'zod';

export const UserJoinValidator = z.object({
  email: z
    .string()
    .min(1, '필수 입력 사항 입니다.')
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
      message: '이메일 형식에 맞게 입력해 주세요.',
    }),
  password: z
    .string()
    .min(6, {
      message: '최소 6글자 이상 입력해 주세요.',
    })
    .max(21, {
      message: '최대 21글자까지만 가능합니다.',
    }),
  username: z
    .string()
    .min(2, {
      message: '최소 2글자 이상 입력해 주세요.',
    })
    .max(10, {
      message: '최대 10글자까지만 가능합니다.',
    }),
});

export const UserLoginValidator = z.object({
  email: z
    .string()
    .min(1, '필수 입력 사항 입니다.')
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
      message: '이메일 형식에 맞게 입력해 주세요.',
    }),
  password: z
    .string()
    .min(6, {
      message: '최소 6글자 이상 입력해 주세요.',
    })
    .max(21, {
      message: '최대 21글자까지만 가능합니다.',
    }),
});

export type UserJoinRequest = z.infer<
  typeof UserJoinValidator
>;

export type UserLoginRequest = z.infer<
  typeof UserLoginValidator
>;
