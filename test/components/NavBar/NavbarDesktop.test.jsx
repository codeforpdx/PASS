import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import NavbarDesktop from '../../../src/components/NavBar/NavbarDesktop';

it('renders icon menu when on screen larger than mobile', () => {
  const { queryByLabelText } = render(<NavbarDesktop />);

  const logo = queryByLabelText('logo');
  const navLinks = queryByLabelText('navigation links');
  const iconMenu = queryByLabelText('menu');

  expect(logo).not.toBeNull();
  expect(navLinks).not.toBeNull();
  expect(iconMenu).not.toBeNull();
});
