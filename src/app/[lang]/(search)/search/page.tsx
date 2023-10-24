import SearchResult from '@/components/SearchResult';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';

const page = async ({
  params,
}: {
  params: { lang: Locale };
}) => {
  const lang = params.lang ?? 'en';
  const { search } = await getDictionary(lang);

  return <SearchResult text={search} />;
};

export default page;
