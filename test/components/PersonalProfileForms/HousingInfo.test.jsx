import React from 'react';
import { render } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { HousingInfo } from '@components/CivicProfileForms';

describe('Housing info form', () => {
  it('renders', () => {
    const { getByText } = render(<HousingInfo />);
    expect(getByText('Housing Info')).not.toBeNull();
  });
});
