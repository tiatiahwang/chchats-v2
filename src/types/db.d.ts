import { Category, Subcategory } from '@prisma/client';

export type ExtendedCategory = Category & {
  subcategories: Subcategory[];
};

export type ExtendedPost = Post & {
  author: {
    id: string;
    username: string | null;
  };
  category: {
    ref: string | null;
  };
  subcategory: {
    name: string;
    ref: string | null;
  };
  _count: {
    comments: number;
  };
};
