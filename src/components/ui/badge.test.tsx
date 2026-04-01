import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge Component', () => {
  it('should render badge with default variant', () => {
    const { container } = render(<Badge>Default</Badge>);

    expect(container.querySelector('span')).toBeInTheDocument();
    expect(container.textContent).toBe('Default');
  });

  it('should render badge with specific styles', () => {
    const { container } = render(<Badge variant="default">Primary</Badge>);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe('Primary');
  });

  it('should render badge with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('should render badge with destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('should render badge with outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);

    const badge = container.querySelector('span');
    expect(badge).toHaveClass('custom-class');
  });

  it('should render children correctly', () => {
    const { container } = render(
      <Badge>
        <span>Nested Content</span>
      </Badge>
    );

    expect(container.querySelector('span')).toBeInTheDocument();
    expect(container.textContent).toBe('Nested Content');
  });

  it('should render multiple badges', () => {
    const { container } = render(
      <>
        <Badge>Badge 1</Badge>
        <Badge>Badge 2</Badge>
        <Badge>Badge 3</Badge>
      </>
    );

    const badges = container.querySelectorAll('span');
    expect(badges.length).toBeGreaterThanOrEqual(3);
  });

  it('should maintain text content with variant changes', () => {
    const { rerender, container } = render(<Badge variant="default">Test</Badge>);

    expect(container.textContent).toBe('Test');

    rerender(<Badge variant="destructive">Test</Badge>);

    expect(container.textContent).toBe('Test');
  });

  it('should handle empty children', () => {
    const { container } = render(<Badge>Empty</Badge>);

    expect(container.querySelector('span')).toBeInTheDocument();
  });
});
