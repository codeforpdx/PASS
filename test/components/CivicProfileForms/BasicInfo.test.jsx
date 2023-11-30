import React from 'react';
import { render } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { BasicInfo } from '@components/CivicProfileForms';

describe('Basic Info Form', () => {
  it('renders', () => {
    const { getByText } = render(<BasicInfo />);
    expect(getByText('Basic Info')).not.toBeNull();
  });
});
