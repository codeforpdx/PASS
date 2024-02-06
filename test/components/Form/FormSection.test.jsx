import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { FormSection } from '@components/Form';

const MockChildrenComponent = () => <div />;

const MockFormSection = () => (
  <FormSection title="Example Title" headingId="test">
    <MockChildrenComponent />
  </FormSection>
);

it('renders', () => {
  const component = render(<MockFormSection />);
  expect(component.getByText('Example Title')).not.toBeNull();
});
