import { ReactNode } from 'react';

interface PolicySection {
  id: number;
  title: string;
  content?: string | ReactNode;
  items?: string[];
  subsections?: {
    title: string;
    items: string[];
    note?: string;
  }[];
  note?: string;
}

interface PolicyContentProps {
  intro: {
    description: string;
    agreement?: string;
  };
  sections: PolicySection[];
}

export const PolicyContent = ({ intro, sections }: PolicyContentProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-black">
      {/* Intro section */}
      <div className="mb-12 flex flex-col gap-4">
        <p className="text-sm sm:text-base leading-relaxed font-normal">
          {intro.description}
        </p>
        {intro.agreement && (
          <p className="text-sm sm:text-base leading-relaxed font-normal">
            {intro.agreement}
          </p>
        )}
      </div>

      {/* Content sections */}
      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="scroll-mt-32"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4 leading-snug">
              {section.id}. {section.title}
            </h2>
            <div className="flex flex-col gap-4">
              {section.content && (
                <div className="text-sm sm:text-base leading-relaxed">
                  {section.content}
                </div>
              )}

              {/* List items for main section */}
              {section.items && (
                <ul className="flex flex-col gap-2 pl-4 list-disc">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm sm:text-base leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Subsections */}
              {section.subsections && (
                <div className="flex flex-col gap-6">
                  {section.subsections.map((sub, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <h3 className="text-base sm:text-lg font-semibold leading-snug">
                        {sub.title}
                      </h3>
                      <ul className="flex flex-col gap-2 pl-4 list-disc">
                        {sub.items.map((item, iIdx) => (
                          <li
                            key={iIdx}
                            className="text-sm sm:text-base leading-relaxed"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                      {sub.note && (
                        <p className="text-sm sm:text-base leading-relaxed">
                          {sub.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* General section note */}
              {section.note && (
                <p className="text-sm sm:text-base leading-relaxed">
                  {section.note}
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
