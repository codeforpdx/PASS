import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KeyFeatures } from '@components/Home';
import createMatchMedia from '../../helpers/createMatchMedia';
import isAccessible from '../../utils/axe';

const MockKeyFeaturesDefault = () => <KeyFeatures description="Example Text" />;
const MockKeyFeaturesMobile = () => <KeyFeatures isReallySmallScreen description="Example Text" />;

describe('Accessibility', () => {
  // TODO: Fix accessibility issues with this component
  it.skip('should be accessible', async () => {
    await isAccessible(render(<MockKeyFeaturesDefault />));
  });

  // TODO: Fix accessibility issues with this component
  it.skip('should be accessible on mobile', async () => {
    await isAccessible(render(<MockKeyFeaturesMobile />));
  });
});

it('renders less width by default', () => {
  const { getByText } = render(<MockKeyFeaturesDefault />);
  const description = getByText('Example Text');
  const descriptionStyles = getComputedStyle(description);

  expect(descriptionStyles.width).not.toBe('100%');
});

it('renders 100% width mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByText } = render(<MockKeyFeaturesMobile />);
  const description = getByText('Example Text');
  const descriptionStyles = getComputedStyle(description);

  expect(descriptionStyles.width).toBe('100%');
});
