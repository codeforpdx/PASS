import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, it, describe } from 'vitest';
import { HmisProfile } from '@pages';

describe('HMIS Profile', () => {
  it('renders', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <HmisProfile />
      </BrowserRouter>
    );
    expect(getByRole('navigation')).not.toBeNull();
  });
});
