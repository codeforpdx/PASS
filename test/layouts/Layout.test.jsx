import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as hooks from '@hooks';
import { SessionContext } from '@contexts';
import { ThemeProvider } from '@mui/material/styles';
import { NavBar } from '@components/NavBar';
import Layout from '../../src/layouts/Layout';
import theme from '../../src/theme';
import createMatchMedia from '../helpers/createMatchMedia';

const MockLayout = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Layout ariaLabel="test">
        <NavBar />
      </Layout>
    </BrowserRouter>
  </ThemeProvider>
);

describe('Desktop view', () => {
  it('Renders breadcrumb when logged in, layout grid-template-rows as 64px 64px 1fr 280px', () => {
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

    const test = queryByLabelText('test');
    const cssProperty = getComputedStyle(test);

    expect(cssProperty['grid-template-rows']).toBe('64px 64px 1fr 280px');
  });

  it('renders no breadcrumbs, layout grid-template-rows as 64px 1fr 280px when logged out', () => {
    vi.spyOn(hooks, 'useNotification').mockReturnValue({
      state: { notifications: [] }
    });
    const { queryByLabelText } = render(<MockLayout />);

    const breadcrumb = queryByLabelText('breadcrumb');

    expect(breadcrumb).toBeNull();

    const test = queryByLabelText('test');
    const cssProperty = getComputedStyle(test);

    expect(cssProperty['grid-template-rows']).toBe('64px 1fr 280px');
  });
});

describe('Mobile view below 600px', () => {
  it('Renders breadcrumb when logged in, layout grid-template-rows as 64px 64px 1fr 560px', () => {
    window.matchMedia = createMatchMedia(599);
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

    const test = queryByLabelText('test');
    const cssProperty = getComputedStyle(test);

    expect(cssProperty['grid-template-rows']).toBe('64px 64px 1fr 560px');
  });

  it('renders no breadcrumbs, layout grid-template-rows as 64px 1fr 560px when logged out', () => {
    window.matchMedia = createMatchMedia(599);
    vi.spyOn(hooks, 'useNotification').mockReturnValue({
      state: { notifications: [] }
    });
    const { queryByLabelText } = render(<MockLayout />);

    const breadcrumb = queryByLabelText('breadcrumb');

    expect(breadcrumb).toBeNull();

    const test = queryByLabelText('test');
    const cssProperty = getComputedStyle(test);

    expect(cssProperty['grid-template-rows']).toBe('64px 1fr 560px');
  });
});
