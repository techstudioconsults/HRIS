import { describe, it, expect } from '@workspace/test-utils';
import { render, screen } from '@workspace/test-utils';
import { Badge, badgeVariants, VariantProps } from '@workspace/ui/components/badge';

/**
 * Example component test for user-dashboard
 */

const BadgeComponent = ({
  children,
  variant = 'default',
}: {
  children: string;
  variant?: VariantProps<typeof badgeVariants>['variant'];
}) => (
  <Badge variant={variant} className={`badge`}>
    {children}
  </Badge>
);

describe('Badge Component', () => {
  it('should render with default variant', () => {
    render(<BadgeComponent>Active</BadgeComponent>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render with custom variant', () => {
    render(<BadgeComponent variant="success">Active</BadgeComponent>);
    expect(screen.getByText('Active')).toHaveClass('bg-success-50');
  });
});
