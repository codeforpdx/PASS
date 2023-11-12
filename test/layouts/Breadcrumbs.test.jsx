import React from 'react';
import { expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Breadcrumbs from '../../src/layouts/Breadcrumbs';

vi.mock('react-router-dom', async () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn().mockReturnValue({
      pathname: '/apple-pie/banana-pie/cherry-pie'
    }),
    Link: vi.fn().mockImplementation(({ to, children }) => <a href={to}>{children}</a>)
  };
});

it('Renders correct routes and links', () => {
  const { queryByText } = render(<Breadcrumbs />);

  const aPath = queryByText('Apple Pie');
  const bPath = queryByText('Banana Pie');
  const cPath = queryByText('Cherry Pie');

  expect(aPath).not.toBeNull();
  expect(bPath).not.toBeNull();
  expect(cPath).not.toBeNull();

  expect(aPath.getAttribute('href')).toBe('/apple-pie');
  expect(bPath.getAttribute('href')).toBe('/apple-pie/banana-pie');
  expect(cPath.getAttribute('href')).not.toBe('/apple-pie/banana-pie/cherry-pie');
  expect(cPath.getAttribute('href')).toBeNull();
});
