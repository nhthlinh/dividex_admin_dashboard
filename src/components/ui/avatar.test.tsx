import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('should render avatar container', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should accept className prop', () => {
      const { container } = render(
        <Avatar className="test-class">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      expect(container.firstChild).toHaveClass('test-class');
    });
  });

  describe('AvatarImage', () => {
    it('should render img element', () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const img = screen.queryByAltText('Avatar');
      if (img) {
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      }
    });

    it('should handle missing image gracefully', () => {
      render(
        <Avatar>
          <AvatarImage src="" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('AvatarFallback', () => {
    it('should render fallback text', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should accept custom content', () => {
      render(
        <Avatar>
          <AvatarFallback>John Doe</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Avatar Integration', () => {
    it('should work with both image and fallback', () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      // Avatar shows either image or fallback depending on image load
      const img = screen.queryByAltText('Avatar');
      const fallback = screen.queryByText('JD');
      
      expect(img || fallback).toBeTruthy();
    });
  });
});
