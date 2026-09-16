import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { expect, it, afterEach, describe } from 'vitest';

import FormLayout from '../../../src/components/CivicProfileForms/FormLayout';

describe('FormLayout restorePath', () => {
  afterEach(() => {
    localStorage.clear();
    cleanup();
  });

  it('stores the current path so an unknown URL can restore it', () => {
    render(
      <MemoryRouter
        initialEntries={['/civic-profile/housing-info']}
        future={{ v7_relativeSplatPath: true }}
      >
        <FormLayout>
          <div>form body</div>
        </FormLayout>
      </MemoryRouter>
    );
    expect(localStorage.getItem('restorePath')).toBe('/civic-profile/housing-info');
  });
});
