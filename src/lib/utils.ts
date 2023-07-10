import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cls = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes));
};
