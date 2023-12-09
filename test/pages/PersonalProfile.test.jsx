import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, it, describe } from 'vitest';
import { Profile } from '@pages';
import { PROFILE_FORM_LIST } from '@components/ProfileForms';

describe('Profile', () => {
  const numLinks = PROFILE_FORM_LIST.length;

  it('renders buttons for all forms in PROFILE_FORM_LIST', () => {
    const { getByRole, getAllByRole } = render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    expect(getByRole('navigation')).not.toBeNull();
    expect(getAllByRole('link').length).toEqual(numLinks);
  });
});
