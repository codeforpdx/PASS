import { axe } from 'vitest-axe';
import { expect } from 'vitest';

const isAccessible = async (renderResult) => {
  expect(await axe(renderResult.container)).toHaveNoViolations();
};

export default isAccessible;
