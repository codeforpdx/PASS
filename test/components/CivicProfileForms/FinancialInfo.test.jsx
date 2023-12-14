import React from 'react';
import { render } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { FinancialInfo } from '@components/CivicProfileForms';
import isAccessible from '../../utils/axe';

describe('Financial Info Form', () => {
  it('renders', () => {
    const { getByText } = render(<FinancialInfo />);
    expect(getByText('Financial Info')).not.toBeNull();
  });

  it('should be accessible', async () => {
    await isAccessible(render(<FinancialInfo />));
  });
});
