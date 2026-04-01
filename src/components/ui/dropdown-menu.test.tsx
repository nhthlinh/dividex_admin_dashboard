/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
} from './dropdown-menu';

// Mock Radix UI dropdown menu
vi.mock('@radix-ui/react-dropdown-menu', () => {
  return {
    Root: ({ children }: any) => <div data-testid="dropdown-root">{children}</div>,
    Trigger: React.forwardRef((props: any, ref: any) => (
      <button ref={ref} data-testid="dropdown-trigger" {...props}>
        {props.children}
      </button>
    )),
    Content: React.forwardRef((props: any, ref: any) => (
      <div ref={ref} data-testid="dropdown-content" {...props}>
        {props.children}
      </div>
    )),
    Portal: ({ children }: any) => <div data-testid="dropdown-portal">{children}</div>,
    Group: ({ children }: any) => <div data-testid="dropdown-group">{children}</div>,
    Item: React.forwardRef((props: any, ref: any) => (
      <div ref={ref} data-testid="dropdown-item" {...props}>
        {props.children}
      </div>
    )),
    Sub: ({ children }: any) => <div data-testid="dropdown-sub">{children}</div>,
    RadioGroup: ({ children }: any) => <div data-testid="dropdown-radio-group">{children}</div>,
  };
});

describe('Dropdown Menu Components', () => {
  describe('DropdownMenu', () => {
    it('should render dropdown root', () => {
      render(
        <DropdownMenu>
          <div>Menu Content</div>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-root')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(
        <DropdownMenu>
          <div>Root Content</div>
        </DropdownMenu>
      );

      expect(screen.getByText('Root Content')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuTrigger', () => {
    it('should render trigger button', () => {
      render(
        <DropdownMenuTrigger>
          Open Menu
        </DropdownMenuTrigger>
      );

      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
    });

    it('should render trigger with text', () => {
      render(
        <DropdownMenuTrigger>
          Menu Options
        </DropdownMenuTrigger>
      );

      expect(screen.getByText('Menu Options')).toBeInTheDocument();
    });

    it('should be clickable', async () => {
      render(
        <DropdownMenuTrigger>
          Click Me
        </DropdownMenuTrigger>
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      await userEvent.click(trigger);

      expect(trigger).toBeInTheDocument();
    });

    it('should forward ref', () => {
      const ref = { current: null };
      render(
        <DropdownMenuTrigger ref={ref}>
          Trigger
        </DropdownMenuTrigger>
      );

      expect(ref.current).not.toBeNull();
    });
  });

  describe('DropdownMenuContent', () => {
    it('should render content container', () => {
      render(
        <DropdownMenuContent>
          Menu Items
        </DropdownMenuContent>
      );

      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    });

    it('should render within portal', () => {
      render(
        <DropdownMenuContent>
          Content
        </DropdownMenuContent>
      );

      expect(screen.getByTestId('dropdown-portal')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(
        <DropdownMenuContent>
          Content
        </DropdownMenuContent>
      );

      const content = screen.getByTestId('dropdown-content');
      expect(content.className).toContain('z-50');
      expect(content.className).toContain('min-w-[8rem]');
      expect(content.className).toContain('rounded-md');
      expect(content.className).toContain('border');
      expect(content.className).toContain('bg-white');
      expect(content.className).toContain('shadow-md');
    });

    it('should accept custom className', () => {
      render(
        <DropdownMenuContent className="custom-class">
          Content
        </DropdownMenuContent>
      );

      const content = screen.getByTestId('dropdown-content');
      expect(content).toHaveClass('custom-class');
    });

    it('should set side offset', () => {
      render(
        <DropdownMenuContent sideOffset={8}>
          Content
        </DropdownMenuContent>
      );

      const content = screen.getByTestId('dropdown-content');
      expect(content).toBeInTheDocument();
    });

    it('should forward ref', () => {
      const ref = { current: null };
      render(
        <DropdownMenuContent ref={ref}>
          Content
        </DropdownMenuContent>
      );

      expect(ref.current).not.toBeNull();
    });

    it('should render menu items', () => {
      render(
        <DropdownMenuContent>
          <div>Item 1</div>
          <div>Item 2</div>
        </DropdownMenuContent>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuItem', () => {
    it('should render menu item', () => {
      render(
        <DropdownMenuItem>
          Option
        </DropdownMenuItem>
      );

      expect(screen.getByTestId('dropdown-item')).toBeInTheDocument();
    });

    it('should render item with text', () => {
      render(
        <DropdownMenuItem>
          Delete
        </DropdownMenuItem>
      );

      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(
        <DropdownMenuItem>
          Item
        </DropdownMenuItem>
      );

      const item = screen.getByTestId('dropdown-item');
      expect(item.className).toContain('relative');
      expect(item.className).toContain('flex');
      expect(item.className).toContain('cursor-default');
      expect(item.className).toContain('select-none');
      expect(item.className).toContain('items-center');
      expect(item.className).toContain('rounded-sm');
      expect(item.className).toContain('px-2');
      expect(item.className).toContain('py-1.5');
      expect(item.className).toContain('text-sm');
    });

    it('should accept custom className', () => {
      render(
        <DropdownMenuItem className="custom-item">
          Item
        </DropdownMenuItem>
      );

      const item = screen.getByTestId('dropdown-item');
      expect(item).toHaveClass('custom-item');
    });

    it('should be clickable', async () => {
      const mockClick = vi.fn();
      render(
        <DropdownMenuItem onClick={mockClick}>
          Click Item
        </DropdownMenuItem>
      );

      const item = screen.getByTestId('dropdown-item');
      await userEvent.click(item);

      expect(mockClick).toHaveBeenCalled();
    });

    it('should forward ref', () => {
      const ref = { current: null };
      render(
        <DropdownMenuItem ref={ref}>
          Item
        </DropdownMenuItem>
      );

      expect(ref.current).not.toBeNull();
    });

    it('should render with children elements', () => {
      render(
        <DropdownMenuItem>
          <span>Icon</span>
          <span>Label</span>
        </DropdownMenuItem>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuGroup', () => {
    it('should render group container', () => {
      render(
        <DropdownMenuGroup>
          <div>Group Items</div>
        </DropdownMenuGroup>
      );

      expect(screen.getByTestId('dropdown-group')).toBeInTheDocument();
    });

    it('should render multiple items in group', () => {
      render(
        <DropdownMenuGroup>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </DropdownMenuGroup>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuPortal', () => {
    it('should render portal', () => {
      render(
        <DropdownMenuPortal>
          <div>Portal Content</div>
        </DropdownMenuPortal>
      );

      expect(screen.getByTestId('dropdown-portal')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuSub', () => {
    it('should render submenu', () => {
      render(
        <DropdownMenuSub>
          <div>Submenu</div>
        </DropdownMenuSub>
      );

      expect(screen.getByTestId('dropdown-sub')).toBeInTheDocument();
    });

    it('should render submenu content', () => {
      render(
        <DropdownMenuSub>
          <div>Submenu Item 1</div>
          <div>Submenu Item 2</div>
        </DropdownMenuSub>
      );

      expect(screen.getByText('Submenu Item 1')).toBeInTheDocument();
      expect(screen.getByText('Submenu Item 2')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuRadioGroup', () => {
    it('should render radio group', () => {
      render(
        <DropdownMenuRadioGroup>
          <div>Radio Items</div>
        </DropdownMenuRadioGroup>
      );

      expect(screen.getByTestId('dropdown-radio-group')).toBeInTheDocument();
    });

    it('should render multiple radio options', () => {
      render(
        <DropdownMenuRadioGroup>
          <div>Option 1</div>
          <div>Option 2</div>
        </DropdownMenuRadioGroup>
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Dropdown Menu integration', () => {
    it('should render complete dropdown menu structure', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>
            Open
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-root')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
      expect(screen.getAllByTestId('dropdown-item')).toHaveLength(2);
    });

    it('should render grouped items', () => {
      render(
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Group Item 1</DropdownMenuItem>
            <DropdownMenuItem>Group Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem>Group Item 3</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      );

      expect(screen.getAllByTestId('dropdown-group')).toHaveLength(2);
      expect(screen.getAllByTestId('dropdown-item')).toHaveLength(3);
    });

    it('should render with radio group options', () => {
      render(
        <DropdownMenuContent>
          <DropdownMenuRadioGroup>
            <DropdownMenuItem>Radio 1</DropdownMenuItem>
            <DropdownMenuItem>Radio 2</DropdownMenuItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      );

      expect(screen.getByTestId('dropdown-radio-group')).toBeInTheDocument();
      expect(screen.getAllByTestId('dropdown-item')).toHaveLength(2);
    });

    it('should render with submenu', () => {
      render(
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
            <DropdownMenuItem>Option 2</DropdownMenuItem>
          </DropdownMenuSub>
        </DropdownMenuContent>
      );

      expect(screen.getByTestId('dropdown-sub')).toBeInTheDocument();
    });
  });
});
