import { render } from '@testing-library/react';
import React from 'react';
import { expect, it, describe } from 'vitest';
import ManageUsers  from '../../../../src/components/Users/ManageUsers';

describe('When page loads', () => {
  it('renders correctly', () => {
    const { container } = render(<ManageUsers />);
    expect(container).toMatchSnapshot();
  });
});
