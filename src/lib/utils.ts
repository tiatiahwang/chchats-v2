import { db } from './db';

export const getAllCategories = async () => {
  const categories = await db.category.findMany({
    where: { isDefault: true },
    include: {
      subcategories: true,
    },
  });
  return categories;
};

export const getCategoryURLs = async () => {
  const categories = await getAllCategories();
  return categories.map((category) => category.ref);
};

export const getSubcategoryURLs = async (
  category: string,
) => {
  const categories = await getAllCategories();
  const parentCategory = categories.filter(
    (cate) => cate.ref === category,
  );
  const subcategories = parentCategory[0].subcategories;
  return subcategories.map((sub) => sub.ref);
};

export const formatTime = (date: Date, lang: string) => {
  const start = new Date(date);
  const end = new Date();

  const diff = (+end - +start) / 1000;

  const times = [
    {
      name: `${lang === 'en' ? 'year' : '년'}`,
      milliSeconds: 60 * 60 * 24 * 365,
    },
    {
      name: `${lang === 'en' ? 'month' : '개월'}`,
      milliSeconds: 60 * 60 * 24 * 30,
    },
    {
      name: `${lang === 'en' ? 'day' : '일'}`,
      milliSeconds: 60 * 60 * 24,
    },
    {
      name: `${lang === 'en' ? 'hour' : '시간'}`,
      milliSeconds: 60 * 60,
    },
    {
      name: `${lang === 'en' ? 'min' : '분'}`,
      milliSeconds: 60,
    },
  ];

  for (const value of times) {
    const betweenTime = Math.floor(
      diff / value.milliSeconds,
    );

    if (betweenTime > 0) {
      return `${betweenTime} ${value.name} ${
        lang === 'en' ? 'ago' : '전'
      }`;
    }
  }

  const text = lang === 'en' ? 'just now' : '방금 전';
  return text;
};
