import React from 'react';
import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import UploadButtonGroup from '../../../src/components/Modals/UploadButtonGroup';

const MockUploadButtonGroup = () => <UploadButtonGroup />;

it('renders only one button above 768px', () => {
  const { getAllByRole } = render(<MockUploadButtonGroup />);
  const buttons = getAllByRole('button');

  expect(buttons.length).toBe(2);
});
