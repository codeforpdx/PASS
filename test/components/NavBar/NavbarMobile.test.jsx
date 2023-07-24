import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import NavbarMobile from '../../../src/components/NavBar/NavbarMobile';

it('renders hamburger menu when on mobile', () => {
  const { queryByLabelText } = render(<NavbarMobile />);

  const logo = queryByLabelText('logo');
  const navLinks = queryByLabelText('navigation links');
  const hamburgerMenu = queryByLabelText('mobile menu');

  expect(logo).not.toBeNull();
  expect(navLinks).not.toBeNull();
  expect(hamburgerMenu).not.toBeNull();
});
