import { CTA, Hero } from '../../../../components/common';
import { HelpSidebar, HelpArticleContent } from '../../../../components/help';
import {
  HELP_CENTER_DATA,
  HelpCategory,
  HelpArticle,
} from '../../../../constants/help-center';
import { notFound } from 'next/navigation';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug, category } = await params;

  const cat = HELP_CENTER_DATA.find((c: HelpCategory) => c.slug === category);

  if (!cat) return notFound();

  const article = cat.articles.find((a: HelpArticle) => a.slug === slug);

  if (!article) return notFound();

  return (
    <>
      <Hero
        title="How can we help you"
        searchPlaceholder="Search for guides, features, or support articles"
      />
      <Wrapper className="grid grid-cols-1 space-y-10 gap-0 lg:gap-10 lg:grid-cols-12">
        <HelpSidebar />
        <HelpArticleContent article={article} categoryTitle={cat.title} />
      </Wrapper>
      <CTA
        title="Still Need Help"
        description="If you can't find what you're looking for, our support team is ready to help."
        primaryButtonText="Contact Support"
        primaryButtonHref="/contact"
        showSecondaryButton={false}
      />
    </>
  );
};

export default Page;
