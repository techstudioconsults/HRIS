import { describe, it, expect } from '@workspace/test-utils';
import { render, screen } from '@workspace/test-utils';

/**
 * Example component test
 * Place your actual component tests in this directory
 */

// Simple test component for demonstration
const Button = ({ children, onClick }: { children: string; onClick?: () => void }) => (
  <button onClick={onClick}>{children}</button>
);

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);
    getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
