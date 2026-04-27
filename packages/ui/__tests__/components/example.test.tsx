import { describe, it, expect, vi } from '@workspace/test-utils';
import { render, screen, fireEvent } from '@workspace/test-utils';
import { MainButton } from '../../src/lib/button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<MainButton>Click me</MainButton>);
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <MainButton onClick={handleClick}>Click me</MainButton>
    );
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
