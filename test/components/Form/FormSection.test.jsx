import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { FormSection } from '@components/Form';
import createMatchMedia from '../../test-helper/createMatchMedia';

const MockChildrenComponent = () => <div />;

const MockFormSection = () => (
  <FormSection title="Example Title">
    <MockChildrenComponent />
  </FormSection>
);

it('renders 20px padding by default', () => {
  const component = render(<MockFormSection />);
  const adjustableBox = getComputedStyle(component.container.firstChild);

  expect(adjustableBox.padding).toBe('20px');
});

it("renders 10px padding after MUI breakpoint 'sm' is triggered", () => {
  window.matchMedia = createMatchMedia(599);

  const component = render(<MockFormSection />);
  const adjustableBox = getComputedStyle(component.container.firstChild);

  expect(adjustableBox.padding).toBe('10px');
});
