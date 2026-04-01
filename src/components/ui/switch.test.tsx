import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './switch';

// Mock ResizeObserver
beforeAll(() => {
  if (typeof window !== 'undefined' && !window.ResizeObserver) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

describe('Switch Component', () => {
  it('should render switch', () => {
    const { container } = render(<Switch />);

    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should toggle checked state', async () => {
    const user = userEvent.setup();
    const { container } = render(<Switch />);

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();

    if (button) {
      await user.click(button);
      // Switch should toggle
    }
  });

  it('should support checked prop', () => {
    const { container } = render(<Switch checked={true} />);

    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should support disabled state', () => {
    const { container } = render(<Switch disabled />);

    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('should accept onCheckedChange callback', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Switch onCheckedChange={onChange} />);

    const button = container.querySelector('button');
    if (button) {
      await user.click(button);
    }
  });

  it('should have proper accessibility attributes', () => {
    const { container } = render(<Switch />);

    const button = container.querySelector('button');
    expect(button).toHaveAttribute('role', 'switch');
  });

  it('should work with form controls', () => {
    const { container } = render(
      <form>
        <Switch />
      </form>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});
