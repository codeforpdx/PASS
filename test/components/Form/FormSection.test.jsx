import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { describe, afterEach, expect, it } from 'vitest';
import { FormSection } from '@components/Form';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockChildrenComponent = () => <div />;

const MockFormSection = () => (
  <FormSection title="Example Title">
    <MockChildrenComponent />
  </FormSection>
);

describe('Form Rendering', () => {
  afterEach(() => {
    cleanup();
    delete window.matchMedia;
  });

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
});
