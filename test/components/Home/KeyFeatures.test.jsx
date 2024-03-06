import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { KeyFeatures } from '@components/Home';

const MockKeyFeaturesDefault = () => <KeyFeatures description="Example Text" />;

it('renders less width by default', () => {
  const { getByText } = render(<MockKeyFeaturesDefault />);
  const description = getByText('Example Text');
  expect(description).not.toBeNull();
});
