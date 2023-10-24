import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const categories = [
  {
    name: '자유게시판',
    eng: 'Board',
    url: '/board',
    description: '',
    ref: 'board',
    isDefault: true,
  },
  {
    name: '묻고답하기',
    eng: 'QnA',
    url: '/qna',
    description: '',
    ref: 'qna',
    isDefault: true,
  },
  {
    name: '온라인마켓',
    eng: 'Market',
    url: '/market',
    description: '',
    ref: 'market',
    isDefault: true,
  },
  {
    name: '지역소모임',
    eng: 'Region',
    url: '/region',
    description: '',
    ref: 'region',
    isDefault: true,
  },
  {
    name: '공지사항',
    eng: 'Notice',
    url: '/notice',
    description: '',
    ref: 'notice',
    isDefault: true,
  },
];

const subcategories = [
  {
    name: '사는얘기',
    eng: 'talk',
    url: '/board/talk',
    ref: 'talk',
    isDefault: true,
    categoryId: 1,
  },
  {
    name: '고민상담',
    eng: 'consult',
    url: '/board/consult',
    ref: 'consult',
    isDefault: true,
    categoryId: 1,
  },
  {
    name: '정보공유',
    eng: 'share',
    url: '/board/share',
    ref: 'share',
    isDefault: true,
    categoryId: 1,
  },
  {
    name: '비자',
    eng: 'visa',
    url: '/qna/visa',
    ref: 'visa',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '법률',
    eng: 'law',
    url: '/qna/law',
    ref: 'law',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '건강',
    eng: 'health',
    url: '/qna/health',
    ref: 'health',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '교육',
    eng: 'edu',
    url: '/qna/education',
    ref: 'education',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '육아',
    eng: 'parenting',
    url: '/qna/parenting',
    ref: 'parenting',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '취업',
    eng: 'job',
    url: '/qna/job',
    ref: 'job',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '부동산',
    eng: 'estate',
    url: '/qna/estate',
    ref: 'estate',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '기타',
    eng: 'etc',
    url: '/qna/etc',
    ref: 'etc',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '팔아요',
    eng: 'sell',
    url: '/market/sell',
    ref: 'sell',
    isDefault: true,
    categoryId: 3,
  },
  {
    name: '살게요',
    eng: 'buy',
    url: '/market/buy',
    ref: 'buy',
    isDefault: true,
    categoryId: 3,
  },
  {
    name: '나눔',
    eng: 'giveaway',
    url: '/market/giveaway',
    ref: 'giveaway',
    isDefault: true,
    categoryId: 3,
  },
  {
    name: '렌트',
    eng: 'rent',
    url: '/market/rent',
    ref: 'rent',
    isDefault: true,
    categoryId: 3,
  },
  {
    name: '산호세',
    eng: 'San Jose',
    url: '/region/sanjose',
    ref: 'sanjose',
    isDefault: true,
    categoryId: 4,
  },
  {
    name: '샌프란',
    eng: 'San Francisco',
    url: '/region/sf',
    ref: 'sf',
    isDefault: true,
    categoryId: 4,
  },
  {
    name: 'LA',
    eng: 'LA',
    url: '/region/la',
    ref: 'la',
    isDefault: true,
    categoryId: 4,
  },
  {
    name: '공지사항',
    eng: 'all',
    url: '/notice/all',
    ref: 'all',
    isDefault: true,
    categoryId: 5,
  },
];
async function main() {
  await prisma.category.createMany({
    data: categories,
  });
  await prisma.subcategory.createMany({
    data: subcategories,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
