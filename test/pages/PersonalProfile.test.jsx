import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, it, describe } from 'vitest';
import { CivicProfile } from '@pages';
import { CIVIC_FORM_LIST } from '@components/CivicProfileForms';

describe('Civic Profile', () => {
  const numLinks = CIVIC_FORM_LIST.length;

  it('renders buttons for all forms in CIVIC_FORM_LIST', () => {
    const { getByRole, getAllByRole } = render(
      <BrowserRouter>
        <CivicProfile />
      </BrowserRouter>
    );
    expect(getByRole('navigation')).not.toBeNull();
    expect(getAllByRole('link').length).toEqual(numLinks);
  });
});
