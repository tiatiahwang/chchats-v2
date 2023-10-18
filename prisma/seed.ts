import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const categories = [
  {
    name: '자유게시판',
    url: '/board',
    description: '',
    ref: 'board',
    isDefault: true,
  },
  {
    name: '묻고답하기',
    url: '/qna',
    description: '',
    ref: 'qna',
    isDefault: true,
  },
  {
    name: '온라인마켓',
    url: '/market',
    description: '',
    ref: 'market',
    isDefault: true,
  },
  {
    name: '지역소모임',
    url: '/region',
    description: '',
    ref: 'region',
    isDefault: true,
  },
  {
    name: '공지사항',
    url: '/notice',
    description: '',
    ref: 'notice',
    isDefault: true,
  },
];

const subcategories = [
  {
    name: '사는얘기',
    url: '/board/talk',
    ref: 'talk',
    isDefault: true,
    categoryId: 1,
  },
  {
    name: '고민상담',
    url: '/board/consult',
    ref: 'consult',
    isDefault: true,
    categoryId: 1,
  },
  {
    name: '정보공유',
    url: '/board/share',
    ref: 'share',
    isDefault: true,
    categoryId: 1,
  },
  {
    name: '비자',
    url: '/qna/visa',
    ref: 'visa',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '법률',
    url: '/qna/law',
    ref: 'law',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '건강',
    url: '/qna/health',
    ref: 'health',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '교육',
    url: '/qna/education',
    ref: 'education',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '육아',
    url: '/qna/parenting',
    ref: 'parenting',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '취업',
    url: '/qna/job',
    ref: 'job',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '부동산',
    url: '/qna/estate',
    ref: 'estate',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '기타',
    url: '/qna/etc',
    ref: 'etc',
    isDefault: true,
    categoryId: 2,
  },
  {
    name: '팔아요',
    url: '/market/sell',
    ref: 'sell',
    isDefault: true,
    categoryId: 3,
  },
  {
    name: '살게요',
    url: '/market/buy',
    ref: 'buy',
    isDefault: true,
    categoryId: 3,
  },
  {
    name: '나눔',
    url: '/market/free',
    ref: 'free',
    isDefault: true,
    categoryId: 3,
  },
  {
    name: '렌트',
    url: '/market/rent',
    ref: 'rent',
    isDefault: true,
    categoryId: 3,
  },
  {
    name: '산호세',
    url: '/region/sanjose',
    ref: 'sanjose',
    isDefault: true,
    categoryId: 4,
  },
  {
    name: '샌프란',
    url: '/region/sf',
    ref: 'sf',
    isDefault: true,
    categoryId: 4,
  },
  {
    name: 'LA',
    url: '/region/la',
    ref: 'la',
    isDefault: true,
    categoryId: 4,
  },
  {
    name: '공지사항',
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
