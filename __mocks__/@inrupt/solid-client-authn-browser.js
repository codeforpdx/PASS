import { vi } from 'vitest';

export * from '@inrupt/solid-client-authn-browser';

export const login = vi.fn(() => Promise.resolve());
