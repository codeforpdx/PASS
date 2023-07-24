import React from 'react';
import { render, cleanup, queryByLabelText } from '@testing-library/react';
import { expect, it, afterEach } from 'vitest';
import NavbarMobile from '../../../src/components/NavBar/NavbarMobile';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

// goes in NavbarMobile test file
it('renders hamburger menu when on mobile', () => {
  render(<NavbarMobile />);

  const logo = queryByLabelText('logo');
  const hamburgerMenu = queryByLabelText('mobile menu');

  expect(logo).not.toBeNull();
  expect(hamburgerMenu).not.toBeNull();
});
