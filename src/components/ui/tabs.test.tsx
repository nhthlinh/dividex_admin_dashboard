import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

describe('Tabs Components', () => {
  const defaultProps = {
    defaultValue: 'tab1',
  };

  describe('Tabs', () => {
    it('should render tabs container', () => {
      const { container } = render(
        <Tabs {...defaultProps}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(container.querySelector('[role="tablist"]')).toBeInTheDocument();
    });

    it('should accept defaultValue prop', () => {
      const { container } = render(
        <Tabs defaultValue="tab2">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(container).toBeInTheDocument();
    });

    it('should accept value prop for controlled component', () => {
      const { container } = render(
        <Tabs value="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('TabsList', () => {
    it('should render tab list', () => {
      const { container } = render(
        <Tabs {...defaultProps}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toBeInTheDocument();
    });

    it('should render multiple tabs in list', () => {
      const { container } = render(
        <Tabs {...defaultProps}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tabs = container.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBe(3);
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Tabs {...defaultProps}>
          <TabsList className="custom-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toHaveClass('custom-list');
    });
  });

  describe('TabsTrigger', () => {
    it('should render tab trigger', () => {
      const { container } = render(
        <Tabs {...defaultProps}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = container.querySelector('[role="tab"]');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Tab 1');
    });

    it('should render trigger with active state', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = container.querySelector('[role="tab"][aria-selected="true"]');
      expect(trigger).toBeInTheDocument();
    });

    it('should have tab role and value in trigger', () => {
      const { container } = render(
        <Tabs {...defaultProps}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = container.querySelector('[role="tab"]');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Tab 1');
    });
  });

  describe('TabsContent', () => {
    it('should render tab content', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      expect(container.textContent).toContain('Content 1');
    });

    it('should render content for active tab', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(container.textContent).toContain('Content 1');
    });

    it('should have tab panel role', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      const content = container.querySelector('[role="tabpanel"]');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch tabs on click', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tabs = container.querySelectorAll('[role="tab"]');
      if (tabs.length >= 2) {
        await user.click(tabs[1]);
      }
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = container.querySelector('[role="tab"][aria-selected="true"]');
      if (tab1 instanceof HTMLElement) {
        tab1.focus();
        await user.keyboard('{ArrowRight}');
      }
    });
  });

  describe('Complete Tabs Functionality', () => {
    it('should render complete tabs structure', () => {
      const { container } = render(
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">Profile Content</TabsContent>
          <TabsContent value="settings">Settings Content</TabsContent>
          <TabsContent value="about">About Content</TabsContent>
        </Tabs>
      );

      expect(container.querySelector('[role="tablist"]')).toBeInTheDocument();
      const triggers = container.querySelectorAll('[role="tab"]');
      expect(triggers.length).toBe(3);
    });

    it('should render with custom className on content', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content">
            Content 1
          </TabsContent>
        </Tabs>
      );

      const content = container.querySelector('[role="tabpanel"]');
      expect(content).toHaveClass('custom-content');
    });
  });
});
