import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './textarea';

describe('Textarea Component', () => {
  it('should render textarea element', () => {
    const { container } = render(<Textarea />);

    expect(container.querySelector('textarea')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    const { container } = render(<Textarea placeholder="Enter text here" />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('should accept input value', async () => {
    const user = userEvent.setup();
    const { container } = render(<Textarea />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    await user.type(textarea, 'Test input');

    expect(textarea.value).toBe('Test input');
  });

  it('should support defaultValue prop', () => {
    const { container } = render(<Textarea defaultValue="Default text" />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Default text');
  });

  it('should support value prop for controlled component', async () => {
    const { rerender, container } = render(<Textarea value="Initial" onChange={() => {}} />);

    let textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Initial');

    rerender(<Textarea value="Updated" onChange={() => {}} />);
    textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Updated');
  });

  it('should support disabled state', () => {
    const { container } = render(<Textarea disabled />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toBeDisabled();
  });

  it('should support readOnly state', () => {
    const { container } = render(<Textarea readOnly value="Read only text" onChange={() => {}} />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute('readonly');
    expect(textarea.value).toBe('Read only text');
  });

  it('should support rows attribute', () => {
    const { container } = render(<Textarea rows={5} />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('should support cols attribute', () => {
    const { container } = render(<Textarea cols={50} />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('cols', '50');
  });

  it('should support maxLength attribute', () => {
    const { container } = render(<Textarea maxLength={100} />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('maxlength', '100');
  });

  it('should call onChange handler', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Textarea onChange={onChange} />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    await user.type(textarea, 'test');

    expect(onChange).toHaveBeenCalled();
  });

  it('should accept custom className', () => {
    const { container } = render(<Textarea className="custom-class" />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('custom-class');
  });

  it('should support focus and blur events', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { container } = render(
      <Textarea onFocus={onFocus} onBlur={onBlur} />
    );

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    await user.click(textarea);
    expect(onFocus).toHaveBeenCalled();

    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  it('should clear text', async () => {
    const user = userEvent.setup();
    const { container } = render(<Textarea defaultValue="Some text" />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    await user.clear(textarea);

    expect(textarea.value).toBe('');
  });

  it('should support multiple lines of text', async () => {
    const user = userEvent.setup();
    const { container } = render(<Textarea />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');

    expect(textarea.value).toContain('Line 1');
    expect(textarea.value).toContain('Line 2');
    expect(textarea.value).toContain('Line 3');
  });

  it('should be a textarea HTML element', () => {
    const { container } = render(<Textarea />);

    const textarea = container.querySelector('textarea');
    expect(textarea?.tagName).toBe('TEXTAREA');
  });

  it('should work in a form', () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <form onSubmit={handleSubmit}>
        <Textarea defaultValue="Form text" />
        <button type="submit">Submit</button>
      </form>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form?.querySelector('textarea')).toBeInTheDocument();
  });

  it('should preserve whitespace and newlines', async () => {
    const user = userEvent.setup();
    const { container } = render(<Textarea />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    await user.type(textarea, '  spaces{Enter}  and{Enter}  newlines  ');

    expect(textarea.value).toMatch(/\s+/);
  });

  it('should support spellCheck attribute', () => {
    const { container } = render(<Textarea spellCheck={false} />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('spellcheck', 'false');
  });

  it('should support wrap attribute', () => {
    const { container } = render(<Textarea wrap="hard" />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('wrap', 'hard');
  });
});
