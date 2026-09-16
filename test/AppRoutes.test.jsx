import { render, cleanup, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { SessionContext } from '@contexts';
import React from 'react';
import { expect, it, vi, afterEach, describe } from 'vitest';

import AppRoutes from '../src/AppRoutes';

vi.mock('../src/pages', () => ({
  CivicProfile: () => <div>civic profile</div>,
  Documents: () => <div>documents</div>,
  Home: () => <div>home</div>,
  Contacts: () => <div>contacts</div>,
  Profile: () => <div>profile</div>,
  Messages: () => <div>messages</div>,
  Signup: () => <div>signup</div>
}));

const LocationProbe = () => <div data-testid="loc">{useLocation().pathname}</div>;

const renderAt = (path) =>
  render(
    <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
      <MemoryRouter initialEntries={[path]} future={{ v7_relativeSplatPath: true }}>
        <AppRoutes />
        <LocationProbe />
      </MemoryRouter>
    </SessionContext.Provider>
  );

describe('AppRoutes unknown path redirect', () => {
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    cleanup();
  });

  it('redirects to the stored restorePath', () => {
    localStorage.setItem('restorePath', '/documents');
    renderAt('/does-not-exist');
    expect(screen.getByTestId('loc').textContent).toBe('/documents');
  });

  it('redirects to /contacts when no restorePath is stored', () => {
    renderAt('/does-not-exist');
    expect(screen.getByTestId('loc').textContent).toBe('/contacts');
  });

  it('ignores a stored path that is not a plain absolute path', () => {
    localStorage.setItem('restorePath', '/\\evil.com');
    renderAt('/does-not-exist');
    expect(screen.getByTestId('loc').textContent).toBe('/contacts');
  });
});
