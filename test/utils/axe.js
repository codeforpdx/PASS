import { axe } from 'vitest-axe';
import { render } from '@testing-library/react';
import { expect } from 'vitest';

const isAccessible = async (jsx) => {
  const { container } = render(jsx);
  expect(await axe(container)).toHaveNoViolations();
};

export default isAccessible;
