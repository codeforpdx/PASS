import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { login } from '@inrupt/solid-client-authn-browser';
import userEvent from '@testing-library/user-event';
import { expect, it, vi, afterEach } from 'vitest';
import OidcLoginComponent from '../../../src/components/NavBar/OidcLoginComponent';
import createMatchMedia from '../../helpers/createMatchMedia';

vi.mock('@inrupt/solid-client-authn-browser');

const renderTest = () =>
  render(
    <BrowserRouter>
      <OidcLoginComponent />
    </BrowserRouter>
  );

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  cleanup();
});

vi.mock('../../../src/constants/', async () => {
  const actual = await vi.importActual('../../../src/constants/');
  return {
    ...actual,
    ENV: {
      VITE_SOLID_IDENTITY_PROVIDER: 'https://www.testurl.com/',
      VITE_SUGGESTED_OIDC_OPTIONS:
        'http://testurl_1.com/, http://testurl_2.com/, http://testurl_3.com/'
    }
  };
});

it('sets OIDC provider on login', async () => {
  const user = userEvent.setup();
  const { getByRole, queryByRole } = renderTest();

  const input = getByRole('combobox');
  const loginButton = queryByRole('button', { name: 'Login' });

  await user.clear(input);
  await user.type(input, 'http://oidc.provider.url/');
  expect(input.value).toBe('http://oidc.provider.url/');

  await user.click(loginButton);
  expect(login).toBeCalled();
  expect(localStorage.getItem('oidcIssuer')).toBe('http://oidc.provider.url/');
});

it('displays a list of suggested providers when focused', async () => {
  const user = userEvent.setup();
  const { getByRole, getByText } = renderTest();

  const input = getByRole('combobox');
  await user.click(input);

  const exampleProvider = getByText('http://testurl_2.com/');
  expect(exampleProvider).not.toBeNull();

  await user.click(exampleProvider);
  expect(input.value).toBe('http://testurl_2.com/');
});

it('renders container items as row default', () => {
  const component = renderTest();
  const container = component.container.firstChild;
  const cssProperty = getComputedStyle(container);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders container items as column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const component = renderTest();
  const container = component.container.firstChild;
  const cssProperty = getComputedStyle(container);

  expect(cssProperty.flexDirection).toBe('column');
});

it('renders at least 2 buttons when mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getAllByRole } = renderTest();
  const buttons = getAllByRole('button');

  expect(buttons.length > 2).toBe(true);
});
