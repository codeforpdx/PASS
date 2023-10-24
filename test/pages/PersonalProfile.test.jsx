import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, it, describe } from 'vitest';
import { PersonalProfile } from '@pages';
import { PERSONAL_FORM_LIST } from '@components/PersonalProfileForms';

describe('Personal Profile', () => {
  const numLinks = PERSONAL_FORM_LIST.length;

  it('renders buttons for all forms in PERSONAL_FORM_LIST', () => {
    const { getByRole, getAllByRole } = render(
      <BrowserRouter>
        <PersonalProfile />
      </BrowserRouter>
    );
    expect(getByRole('navigation')).not.toBeNull();
    expect(getAllByRole('link').length).toEqual(numLinks);
  });
});
