import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { expect, it, vi, afterEach, describe, beforeEach } from 'vitest';
import OidcLoginComponent from '../../../src/components/NavBar/OidcLoginComponent';

vi.mock('@inrupt/solid-client-authn-browser');

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
        'http://localhost:3000/, https://opencommons.net/, https://solidcommunity.net/, https://login.inrupt.com/, https://inrupt.net/'
    }
  };
});

describe('OidcLoginComponent Tests', () => {
  let user;
  let input;
  let getByRole;
  let getByText;
  let exampleProvider;

  beforeEach(async () => {
    user = userEvent.setup();
    const renderResult = render(<OidcLoginComponent />);
    getByRole = renderResult.getByRole;
    getByText = renderResult.getByText;

    input = getByRole('combobox');
    await user.click(input);
    exampleProvider = getByText('https://solidcommunity.net/');
  });

  it('displays a list of suggested providers when focused', () => {
    expect(exampleProvider).not.toBeNull();
  });

  it('updates input value when a provider is clicked', async () => {
    await user.click(exampleProvider);
    expect(input.value).toBe('https://solidcommunity.net/');
  });

  it('saves the provider to localStorage on login', async () => {
    await userEvent.click(input);
    await userEvent.click(exampleProvider);

    const loginButton = getByRole('button');
    await userEvent.click(loginButton);

    expect(localStorage.getItem('oidcIssuer')).toBe('https://solidcommunity.net/');
  });
});
