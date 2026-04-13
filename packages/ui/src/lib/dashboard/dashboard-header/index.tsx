import { cn } from '../../utils';

export const DashboardHeader = ({
  actionComponent,
  title,
  subtitle,
  // showSubscriptionBanner = true,
  titleClassName,
  subtitleClassName,
  icon,
}: {
  actionComponent?: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  // showSubscriptionBanner?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <>
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <span className="bg-primary-50 text-primary flex size-14 items-center justify-center rounded-md p-3">
              {icon}
            </span>
          )}
          <div className={`hidden md:block`}>
            <h4
              className={cn(
                'text-foreground flex items-center gap-2',
                titleClassName
              )}
            >
              {title}
            </h4>
            {subtitle &&
              (typeof subtitle === 'string' ? (
                <p
                  className={cn(
                    'text-primary-200 text-sm font-medium',
                    subtitleClassName
                  )}
                >
                  {subtitle}
                </p>
              ) : (
                subtitle
              ))}
          </div>
        </div>
        {actionComponent}
      </section>
      {/* {showSubscriptionBanner && <SubscriptionBanner />} */}
    </>
  );
};
