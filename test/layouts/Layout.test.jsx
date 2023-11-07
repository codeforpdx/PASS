import React from 'react';
import { expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as hooks from '@hooks';
import { SessionContext } from '@contexts';
import { ThemeProvider } from '@mui/material/styles';
import { NavBar } from '@components/NavBar';
import Layout from '../../src/layouts/Layout';
import theme from '../../src/theme';

const MockLayout = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Layout ariaLabel="test">
        <NavBar />
      </Layout>
    </BrowserRouter>
  </ThemeProvider>
);

it('Renders breadcrumb', () => {
  vi.spyOn(hooks, 'useNotification').mockReturnValue({
    state: { notifications: [] }
  });
  const { queryByLabelText } = render(
    <SessionContext.Provider
      value={{
        session: {
          info: {
            isLoggedIn: true,
            webId: 'https://example.com/pod/profile/card#me'
          }
        }
      }}
    >
      <MockLayout />
    </SessionContext.Provider>
  );

  const breadcrumb = queryByLabelText('breadcrumb');

  expect(breadcrumb).not.toBeNull();
});

it('Does not render breadcrumb when logged in', () => {
  vi.spyOn(hooks, 'useNotification').mockReturnValue({
    state: { notifications: [] }
  });
  const { queryByLabelText } = render(<MockLayout />);

  const breadcrumb = queryByLabelText('breadcrumb');

  expect(breadcrumb).toBeNull();
});
