import { render, cleanup } from '@testing-library/react';
import { login } from '@inrupt/solid-client-authn-browser';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { expect, it, vi, afterEach } from 'vitest';
import OidcLoginComponent from '../../../src/components/NavBar/OidcLoginComponent';

vi.mock('@inrupt/solid-client-authn-browser');

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  cleanup();
});

vi.mock('../../../src/constants/', () => {
  const actual = vi.importActual('../../../src/constants/');
  return {
    ...actual,
    ENV: {
      VITE_SOLID_IDENTITY_PROVIDER: 'https://www.testurl.com/'
    }
  };
});

it('sets OIDC provider on login', async () => {
  const user = userEvent.setup();
  const { getByRole } = render(<OidcLoginComponent />);
  const input = getByRole('textbox');
  const loginButton = getByRole('button');
  await user.clear(input);
  await user.type(input, 'http://oidc.provider.url/');
  expect(input.value).toBe('http://oidc.provider.url/');
  await user.click(loginButton);
  expect(login).toBeCalled();
  expect(localStorage.getItem('oidcIssuer')).toBe('http://oidc.provider.url/');
});
