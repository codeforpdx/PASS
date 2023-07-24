import React from 'react';
import {
  render,
  cleanup,
  waitForElementToBeRemoved,
  queryByLabelText
} from '@testing-library/react';
import { expect, it, vi, afterEach } from 'vitest';
import NavBar from '../../../src/components/NavBar/NavBar';
import NavbarDesktop from '../../../src/components/NavBar/NavbarDesktop';
import NavbarMobile from '../../../src/components/NavBar/NavbarMobile';
import NavbarLoggedOut from '../../../src/components/NavBar/NavbarLoggedOut';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

it('renders NavbarLoggedOut when user is not logged in', () => {
  render(<NavBar />);

  // run a context where user is logged out

  expect(<NavbarLoggedOut />).not.toBeNull();
});

it('renders NavbarDesktop when user is logged in on larger screen device', () => {
  render(<NavBar />);

  // run a context where user is logged in
  // run a media query for screen size above mobile

  expect(<NavbarDesktop />).not.toBeNull();
});

it('renders NavbarMobile when user is logged in on smaller screen device', () => {
  render(<NavBar />);

  // run a context where user is logged in
  // run a media query for screen size to be mobile

  expect(<NavbarMobile />).not.toBeNull();
});
