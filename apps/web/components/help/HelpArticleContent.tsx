import { HelpArticle, Section } from '../../constants/help-center';
import { Button } from '@workspace/ui/components/button';
import { LucideAlertTriangle, LucideInfo, LucideThumbsDown, LucideThumbsUp } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

interface HelpArticleContentProps {
  article: HelpArticle;
  categoryTitle: string;
}

export const HelpArticleContent = ({ article, categoryTitle }: HelpArticleContentProps) => {
  const renderSection = (section: Section) => (
    <div key={`${section.id}-${section.title}`} className="flex gap-2 md:gap-4">
      {section.isNumbered !== false && (
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md">
          {section.id}
        </div>
      )}
      <div className={cn('flex flex-col gap-2', section.isNumbered === false && 'ml-0')}>
        <h2
          className={cn(
            'text-xl md:text-2xl font-semibold text-[#1E293B]',
            section.isNumbered === false && 'text-xl md:text-2xl font-semibold'
          )}
        >
          {section.title}
        </h2>
        <p className="text-sm md:text-base text-[#64748B] leading-relaxed whitespace-pre-wrap">{section.content}</p>

        {section.items && (
          <ul className="flex flex-col gap-2 ml-2 list-none">
            {section.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm md:text-base text-[#64748B]">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 flex-shrink-0" />
                <span className="leading-relaxed whitespace-pre-wrap">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {section.afterItems && (
          <p className="text-sm md:text-base text-[#64748B] leading-relaxed whitespace-pre-wrap">
            {section.afterItems}
          </p>
        )}
      </div>
    </div>
  );

  const renderImportant = (important: { title: string; items: string[] }) => (
    <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl p-5 md:p-8 flex gap-2 md:gap-4 mt-2">
      <LucideInfo className="text-[#0284C7] flex-shrink-0" size={24} />
      <div className="flex flex-col gap-2 w-full">
        <h4 className="text-xl font-semibold text-[#0369A1]">{important.title}</h4>
        <ul className="flex flex-col gap-2 list-none">
          {important.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm md:text-base text-[#0369A1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] mt-2 flex-shrink-0" />
              <span className="leading-relaxed whitespace-pre-wrap">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderVideo = (videoUrl?: string) => (
    <div className="mt-2 flex flex-col gap-4">
      <h3 className="text-xl md:text-2xl font-[500] italic text-[#1E293B]">Watch the video guide.</h3>
      <div className="relative overflow-hidden shadow-xl border border-gray-100 aspect-video">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Help Video Guide"
          />
        ) : (
          <div className="w-full h-full bg-[#F1F5F9] flex items-center justify-center">
            <span className="text-gray-400 font-medium">Video tutorial coming soon...</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <article className="flex-1 w-full max-w-[800px] flex flex-col gap-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-medium text-[#64748B]">
        <span className="hover:text-blue-500 cursor-pointer">Help Center</span>
        <span>/</span>
        <span className="hover:text-blue-500 cursor-pointer">{categoryTitle}</span>
        <span>/</span>
        <span className="text-gray-400">{article.title}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1E293B] leading-tight">{article.title}</h1>
        <div className="text-sm md:text-base text-[#64748B] leading-relaxed whitespace-pre-wrap">
          {article.description}
        </div>

        {article.caution && (
          <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-5 md:p-6 flex gap-2 md:gap-4">
            <LucideAlertTriangle className="text-[#F97316] flex-shrink-0" size={24} />
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-[#9A3412]">Use caution</h4>
              <p className="text-sm md:text-base text-[#9A3412] leading-relaxed whitespace-pre-wrap">
                {article.caution}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Groups */}
      {article.groups ? (
        <div className="flex flex-col gap-10">
          {article.groups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              {group.title && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#1E293B]">{group.title}</h2>
                  {group.description && (
                    <p className="text-[#64748B] leading-relaxed whitespace-pre-wrap">{group.description}</p>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-4">{group.sections.map(renderSection)}</div>
              {group.important && renderImportant(group.important)}
              {group.videoUrl && renderVideo(group.videoUrl)}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-4">
          {article.sections?.map(renderSection)}
          {article.important && renderImportant(article.important)}
          {(article.videoUrl || !article.groups) && renderVideo(article.videoUrl)}
        </div>
      )}

      {/* Feedback Section */}
      <div className="mt-10 flex flex-col gap-4">
        <p className="text-xl md:text-2xl text-[#1E293B]">Was this article helpful?</p>
        <div className="flex items-center gap-4">
          <Button className="bg-primary hover:bg-primary/80 text-white px-8 h-[56px] flex gap-3">
            <LucideThumbsUp size={22} />
            Yes
          </Button>
          <Button className="bg-[#F8FAFC] hover:bg-gray-100 text-[#64748B] px-8 h-[56px] flex gap-3 border border-gray-100 shadow-none">
            <LucideThumbsDown size={22} />
            No
          </Button>
        </div>
      </div>
    </article>
  );
};
