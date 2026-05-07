import { cn } from '../utils';
import { Icon } from '../icons/icon';

interface CompanyDomainHintProperties {
  /** Additional className for the wrapper container. */
  className?: string;
}

/**
 * Helper text shown below company domain or work email fields explaining that the
 * domain is used to identify the organization and verify employee emails.
 *
 * Shared between signup, add-employee, and edit-employee forms.
 */
export function CompanyDomainHint({ className }: CompanyDomainHintProperties) {
  return (
    <div className={cn('flex items-start gap-1.5 mt-1', className)}>
      <Icon
        name="InfoCircle"
        size={14}
        className="text-muted-foreground shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <p className="text-xs text-muted-foreground italic">
        Used to identify your organization and help verify employee emails (e.g.
        www.techstudiohr.com).
      </p>
    </div>
  );
}
