import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

describe('Table Components', () => {
  describe('Table', () => {
    it('should render table element', () => {
      const { container } = render(<Table />);

      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('should render table with children', () => {
      const { container } = render(
        <Table>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </Table>
      );

      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.textContent).toContain('Content');
    });

    it('should accept custom className', () => {
      const { container } = render(<Table className="custom-table" />);

      const table = container.querySelector('table');
      expect(table).toHaveClass('custom-table');
    });
  });

  describe('TableCaption', () => {
    it('should render caption element', () => {
      const { container } = render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
        </Table>
      );

      const caption = container.querySelector('caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveTextContent('Table Caption');
    });
  });

  describe('TableHeader', () => {
    it('should render thead element', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      expect(container.querySelector('thead')).toBeInTheDocument();
    });

    it('should render header with multiple columns', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column 1</TableHead>
              <TableHead>Column 2</TableHead>
              <TableHead>Column 3</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const headers = container.querySelectorAll('thead th');
      expect(headers.length).toBe(3);
    });
  });

  describe('TableBody', () => {
    it('should render tbody element', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(container.querySelector('tbody')).toBeInTheDocument();
    });

    it('should render multiple rows', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Row 1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3);
    });
  });

  describe('TableRow', () => {
    it('should render tr element', () => {
      const { container } = render(
        <Table>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </Table>
      );

      expect(container.querySelector('tr')).toBeInTheDocument();
    });

    it('should render row with multiple cells', () => {
      const { container } = render(
        <Table>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
            <TableCell>Cell 3</TableCell>
          </TableRow>
        </Table>
      );

      const cells = container.querySelectorAll('tr td');
      expect(cells.length).toBe(3);
    });
  });

  describe('TableCell', () => {
    it('should render td element', () => {
      const { container } = render(
        <Table>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </Table>
      );

      const cell = container.querySelector('td');
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveTextContent('Content');
    });

    it('should support align prop', () => {
      const { container } = render(
        <Table>
          <TableRow>
            <TableCell align="center">Centered</TableCell>
          </TableRow>
        </Table>
      );

      const cell = container.querySelector('td');
      expect(cell).toBeInTheDocument();
    });
  });

  describe('TableHead', () => {
    it('should render th element', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = container.querySelector('th');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header');
    });
  });

  describe('TableFooter', () => {
    it('should render tfoot element', () => {
      const { container } = render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(container.querySelector('tfoot')).toBeInTheDocument();
    });

    it('should render footer with multiple columns', () => {
      const { container } = render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Footer 1</TableCell>
              <TableCell>Footer 2</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const cells = container.querySelectorAll('tfoot td');
      expect(cells.length).toBe(2);
    });
  });

  describe('Complete Table Structure', () => {
    it('should render complete table with all parts', () => {
      const { container } = render(
        <Table>
          <TableCaption>Complete Table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Column 1</TableHead>
              <TableHead>Column 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Data 1</TableCell>
              <TableCell>Data 2</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer 1</TableCell>
              <TableCell>Footer 2</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.querySelector('caption')).toBeInTheDocument();
      expect(container.querySelector('thead')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
      expect(container.querySelector('tfoot')).toBeInTheDocument();
    });
  });
});
