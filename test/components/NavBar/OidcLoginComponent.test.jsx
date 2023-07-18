import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { expect, it, vi, afterEach } from 'vitest';
import OidcLoginComponent from '../../../src/components/NavBar/OidcLoginComponent';

vi.mock('@inrupt/solid-ui-react', () => ({
  LoginButton: ({ children, oidcIssuer, redirectUrl }) => (
    <div>
      {oidcIssuer}
      {redirectUrl}
      {children}
    </div>
  )
}));

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

it('renders correctly', () => {
  const { container } = render(<OidcLoginComponent />);
  expect(container).toMatchSnapshot();
});

it('sets OIDC provider on login', async () => {
  const user = userEvent.setup();
  const { container, getByLabelText } = render(<OidcLoginComponent />);
  const input = getByLabelText('OIDC Input Field').querySelector('input');
  const login = getByLabelText('Login Button');
  vi.spyOn(Storage.prototype, 'setItem');
  await user.clear(input);
  await user.type(input, 'oidc.provider.url');
  expect(input.value).toBe('oidc.provider.url');
  await user.click(login);
  expect(localStorage.setItem).toBeCalledWith('oidcIssuer', 'oidc.provider.url');
  expect(container).toMatchSnapshot();
});
