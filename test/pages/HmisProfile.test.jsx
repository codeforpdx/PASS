import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, it, describe } from 'vitest';
import { HmisProfile } from '@pages';
import { HMIS_FORM_LIST } from '@components/HmisForms';

describe('HMIS Profile', () => {
  const numLinks = HMIS_FORM_LIST.length;

  it('renders buttons for all forms in HMIS_FORM_LIST', () => {
    const { getByRole, getAllByRole } = render(
      <BrowserRouter>
        <HmisProfile />
      </BrowserRouter>
    );
    expect(getByRole('navigation')).not.toBeNull();
    expect(getAllByRole('link').length).toEqual(numLinks);
  });
});
