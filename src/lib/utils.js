import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cls = (...classes) => {
  return twMerge(clsx(classes));
};
