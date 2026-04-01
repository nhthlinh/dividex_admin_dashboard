import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with default styles', () => {
      const { container } = render(<Card>Card Content</Card>);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bg-white', 'text-card-foreground', 'flex', 'flex-col', 'gap-6', 'rounded-xl', 'border');
    });

    it('should render card with custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass('custom-class');
    });

    it('should render card with children', () => {
      const { container } = render(
        <Card>
          <div>Child Content</div>
        </Card>
      );

      expect(container.textContent).toContain('Child Content');
    });

    it('should accept additional props', () => {
      const { container } = render(
        <Card data-testid="custom-card" id="test-id">
          Test
        </Card>
      );

      const card = container.querySelector('[data-testid="custom-card"]');
      expect(card).toHaveAttribute('id', 'test-id');
    });
  });

  describe('CardHeader', () => {
    it('should render card header with default styles', () => {
      const { container } = render(<CardHeader>Header Content</CardHeader>);

      const header = container.querySelector('[data-slot="card-header"]');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('@container/card-header', 'grid', 'auto-rows-min', 'grid-rows-[auto_auto]', 'items-start', 'gap-1.5', 'px-6', 'pt-6');
    });

    it('should render card header with custom className', () => {
      const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);

      const header = container.querySelector('[data-slot="card-header"]');
      expect(header).toHaveClass('custom-header');
    });

    it('should render multiple children in header', () => {
      const { container } = render(
        <CardHeader>
          <div>Title</div>
          <div>Description</div>
        </CardHeader>
      );

      expect(container.textContent).toContain('Title');
      expect(container.textContent).toContain('Description');
    });
  });

  describe('CardTitle', () => {
    it('should render card title as h4 element', () => {
      const { container } = render(<CardTitle>Title Text</CardTitle>);

      const title = container.querySelector('[data-slot="card-title"]');
      expect(title?.tagName).toBe('H4');
      expect(title).toHaveClass('leading-none');
    });

    it('should render card title with text content', () => {
      const { container } = render(<CardTitle>My Card Title</CardTitle>);

      const title = container.querySelector('[data-slot="card-title"]');
      expect(title?.textContent).toBe('My Card Title');
    });

    it('should support custom className on title', () => {
      const { container } = render(<CardTitle className="title-custom">Title</CardTitle>);

      const title = container.querySelector('[data-slot="card-title"]');
      expect(title).toHaveClass('title-custom');
    });
  });

  describe('CardDescription', () => {
    it('should render card description as p element', () => {
      const { container } = render(<CardDescription>Description Text</CardDescription>);

      const description = container.querySelector('[data-slot="card-description"]');
      expect(description?.tagName).toBe('P');
      expect(description).toHaveClass('text-muted-foreground');
    });

    it('should render description with text content', () => {
      const { container } = render(<CardDescription>This is a description</CardDescription>);

      const description = container.querySelector('[data-slot="card-description"]');
      expect(description?.textContent).toBe('This is a description');
    });

    it('should support custom className on description', () => {
      const { container } = render(<CardDescription className="desc-custom">Desc</CardDescription>);

      const description = container.querySelector('[data-slot="card-description"]');
      expect(description).toHaveClass('desc-custom');
    });
  });

  describe('CardAction', () => {
    it('should render card action div', () => {
      const { container } = render(<CardAction>Action</CardAction>);

      const action = container.querySelector('[data-slot="card-action"]');
      expect(action).toBeInTheDocument();
      expect(action).toHaveClass('col-start-2', 'row-span-2', 'row-start-1', 'self-start', 'justify-self-end');
    });

    it('should render action with custom className', () => {
      const { container } = render(<CardAction className="action-custom">Action</CardAction>);

      const action = container.querySelector('[data-slot="card-action"]');
      expect(action).toHaveClass('action-custom');
    });

    it('should accept action content', () => {
      const { container } = render(
        <CardAction>
          <button>Click Me</button>
        </CardAction>
      );

      const button = container.querySelector('button');
      expect(button).toHaveTextContent('Click Me');
    });
  });

  describe('CardContent', () => {
    it('should render card content div', () => {
      const { container } = render(<CardContent>Main Content</CardContent>);

      const content = container.querySelector('[data-slot="card-content"]');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('px-6', '[&:last-child]:pb-6');
    });

    it('should render content with custom className', () => {
      const { container } = render(<CardContent className="content-custom">Content</CardContent>);

      const content = container.querySelector('[data-slot="card-content"]');
      expect(content).toHaveClass('content-custom');
    });

    it('should render multiple children in content', () => {
      const { container } = render(
        <CardContent>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </CardContent>
      );

      expect(container.textContent).toContain('Paragraph 1');
      expect(container.textContent).toContain('Paragraph 2');
    });
  });

  describe('CardFooter', () => {
    it('should render card footer div', () => {
      const { container } = render(<CardFooter>Footer Content</CardFooter>);

      const footer = container.querySelector('[data-slot="card-footer"]');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'px-6', 'pb-6');
    });

    it('should render footer with custom className', () => {
      const { container } = render(<CardFooter className="footer-custom">Footer</CardFooter>);

      const footer = container.querySelector('[data-slot="card-footer"]');
      expect(footer).toHaveClass('footer-custom');
    });

    it('should render footer buttons', () => {
      const { container } = render(
        <CardFooter>
          <button>Cancel</button>
          <button>Save</button>
        </CardFooter>
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(2);
      expect(buttons[0]).toHaveTextContent('Cancel');
      expect(buttons[1]).toHaveTextContent('Save');
    });
  });

  describe('Card integration', () => {
    it('should render complete card structure with all components', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>
              <button>Action Button</button>
            </CardAction>
          </CardHeader>
          <CardContent>Main content goes here</CardContent>
          <CardFooter>
            <button>Cancel</button>
            <button>Submit</button>
          </CardFooter>
        </Card>
      );

      expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-action"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument();
    });

    it('should maintain semantic structure', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );

      const title = container.querySelector('h4');
      expect(title?.textContent).toBe('Title');
    });
  });
});
