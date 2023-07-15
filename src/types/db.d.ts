import { Category, Subcategory } from '@prisma/client';

export type ExtendedCategory = Category & {
  subcategories: Subcategory[];
};
