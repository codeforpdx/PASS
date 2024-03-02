import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, describe, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Signup } from '@pages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContext } from '@contexts';
import { initializePod, registerPod } from '@components/Signup';

vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual('react-router-dom');

  return {
    ...originalModule,
    useSearchParams: () => [new URLSearchParams({ webId: 'https://example.com/profile' })]
  };
});

vi.mock('@components/Signup', async () => {
  const orig = await vi.importActual('@components/Signup');

  return {
    ...orig,
    initializePod: vi.fn(),
    registerPod: vi.fn(() => Promise.resolve({ webId: '', podUrl: '', fetch: vi.fn() }))
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const MockSignupContexts = ({ session }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SessionContext.Provider value={session}>
        <Signup />
      </SessionContext.Provider>
    </BrowserRouter>
  </QueryClientProvider>
);

describe('Signup Page', () => {
  it('renders', () => {
    const sessionObj = {
      login: vi.fn(),
      fetch: vi.fn(),
      podUrl: 'https://example.com',
      session: {
        info: {
          webId: 'https://example.com/profile/',
          isLoggedIn: false
        }
      }
    };
    const { getByRole } = render(<MockSignupContexts session={sessionObj} />);
    expect(getByRole('heading', { name: 'Register For PASS' })).not.toBeNull();
  });
  it('lets users request to create pods', async () => {
    const session = {
      login: vi.fn(),
      fetch: vi.fn(),
      podUrl: 'https://example.com',
      session: {
        info: {
          webId: 'https://example.com/profile/',
          isLoggedIn: false
        }
      }
    };
    const user = userEvent.setup();
    const { getByRole, getAllByRole, getByLabelText } = render(
      <MockSignupContexts session={session} />
    );
    global.fetch = vi.fn(() => Promise.resolve({ json: vi.fn() }));
    const email = 'tim@example.com';
    const password = 'password';
    const confirmPassword = 'password';
    const emailField = getByRole('textbox', { name: 'Email' });
    const passwordField = getByLabelText('Password');
    const confirmPasswordField = getByLabelText('Confirm Password');
    await user.type(emailField, email);
    await user.type(passwordField, password);
    await user.type(confirmPasswordField, confirmPassword);
    await user.click(getAllByRole('button')[2]);

    expect(registerPod).toBeCalledTimes(1);
    expect(initializePod).toBeCalledTimes(1);
  });
  it('shows pod creation message when logged in', () => {
    const session = {
      podUrl: 'https://example.com',
      session: {
        info: {
          webId: 'https://example.com/profile/',
          isLoggedIn: true
        }
      }
    };
    const { getByRole } = render(<MockSignupContexts session={session} />);
    expect(getByRole('heading')).not.toBeNull();
  });
});
