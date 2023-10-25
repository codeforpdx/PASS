import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { KeyFeatures } from '@components/Home';
import createMatchMedia from '../../test-helper/createMatchMedia';

const MockKeyFeaturesDefault = () => <KeyFeatures description="Example Text" />;
const MockKeyFeaturesMobile = () => <KeyFeatures isReallySmallScreen description="Example Text" />;

it('renders 67% width default', () => {
  const { getByText } = render(<MockKeyFeaturesDefault />);
  const component = getByText('Example Text');
  const cssProperty = getComputedStyle(component);

  expect(cssProperty.width).toBe('67%');
});

it('renders 100% width mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByText } = render(<MockKeyFeaturesMobile />);
  const component = getByText('Example Text');
  const cssProperty = getComputedStyle(component);

  expect(cssProperty.width).toBe('100%');
});
