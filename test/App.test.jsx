import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { expect, it, vi, afterEach, beforeEach, describe } from 'vitest';

import App from '../src/App';

vi.mock('@inrupt/solid-client');

vi.mock('../src/hooks/useSession.js', async () => {
  const lib = await vi.importActual('../src/hooks/useSession.js');
  return {
    ...lib,
    useSession: vi.fn(() => ({
      session: {
        fetch: vi.fn(),
        info: {
          isLoggedIn: false,
          webId: 'https://example.com/'
        }
      }
    }))
  };
});

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([{ type: '' }]);
  });

  afterEach(() => {
    window.matchMedia = null;
    vi.clearAllMocks();
    cleanup();
  });

  it('renders', () => {
    const { container } = render(<App />);
    expect(container).not.toBe(null || undefined);
  });
});
