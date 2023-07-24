import React from 'react';
import {
  render,
  cleanup,
  waitForElementToBeRemoved,
  queryByLabelText
} from '@testing-library/react';
import { expect, it, vi, afterEach } from 'vitest';
import NavbarDesktop from '../../../src/components/NavBar/NavbarDesktop';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

// goes in NavbarDesktop test file
it('renders icon menu when on screen larger than mobile', () => {
  render(<NavbarDesktop />);

  const logo = queryByLabelText('logo');
  const navLinks = queryByLabelText('navigation links');
  const iconMenu = queryByLabelText('menu');

  expect(logo).not.toBeNull();
  expect(navLinks).not.toBeNull();
  expect(iconMenu).not.toBeNull();
});
