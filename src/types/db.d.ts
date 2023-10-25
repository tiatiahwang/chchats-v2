import {
  Category,
  Comment,
  Post,
  Scrap,
  Subcategory,
} from '@prisma/client';

export type ExtendedPost = Post & {
  category: {
    eng: string;
    name: string;
    ref: string | null;
  };
  subcategory: {
    eng: string;
    name: string;
    ref: string | null;
  };
};

export type ExtendedPostWithUser = Post & {
  author: {
    id: string;
    username: string | null;
  };
  category: {
    name: string;
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

export type ExtendedCategory = Category & {
  subcategories: Subcategory[];
};

export type ExtendedCommentWithUser = Comment & {
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
  replies: Comment[];
  _count: {
    replies: number;
  };
};

export type ExtendedCommentWithPost = Comment & {
  post: {
    title: string;
    category: {
      name: string;
      ref: string | null;
    };
    subcategory: {
      name: string;
      ref: string | null;
    };
  };
};

export type ExtendedScrap = Scrap & {
  post: {
    title: string;
    category: {
      name: string;
      ref: string | null;
    };
    subcategory: {
      name: string;
      ref: string | null;
    };
  };
};
