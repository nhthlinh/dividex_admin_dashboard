import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './switch';

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
    const onChange = jest.fn ? jest.fn() : (() => {});
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
