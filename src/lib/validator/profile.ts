import { z } from 'zod';

export const PasswordChangeValidator = z.object({
  currentPassword: z
    .string()
    .min(6, {
      message: '최소 6글자 이상 입력해 주세요.',
    })
    .max(21, {
      message: '최대 21글자까지만 가능합니다.',
    }),
  newPassword: z
    .string()
    .min(6, {
      message: '최소 6글자 이상 입력해 주세요.',
    })
    .max(21, {
      message: '최대 21글자까지만 가능합니다.',
    }),
});

export const ChangeUsernameValidator = z.object({
  username: z
    .string()
    .min(2, {
      message: '최소 2글자 이상 입력해 주세요.',
    })
    .max(10, {
      message: '최대 10글자까지만 가능합니다.',
    }),
});

export const EditProfileValidator = z.object({
  avatar: z.any(),
  currentPassword: z
    .string()
    .min(6, {
      message: '최소 6글자 이상 입력해 주세요.',
    })
    .max(21, {
      message: '최대 21글자까지만 가능합니다.',
    })
    .optional()
    .or(z.literal('')),
  newPassword: z
    .string()
    .min(6, {
      message: '최소 6글자 이상 입력해 주세요.',
    })
    .max(21, {
      message: '최대 21글자까지만 가능합니다.',
    })
    .optional()
    .or(z.literal('')),
  username: z
    .string()
    .min(2, {
      message: '최소 2글자 이상 입력해 주세요.',
    })
    .max(10, {
      message: '최대 10글자까지만 가능합니다.',
    })
    .optional()
    .or(z.literal('')),
});

export type EditProfileRequest = z.infer<
  typeof EditProfileValidator
>;
