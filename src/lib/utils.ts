import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { db } from './db';

export const cls = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes));
};

export const getAllCategories = async () => {
  const categories = await db.category.findMany({
    where: { isDefault: true },
    include: {
      subcategories: true,
    },
  });
  return categories;
};
