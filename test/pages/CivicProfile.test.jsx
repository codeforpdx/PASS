import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { CivicProfile } from '@pages';
import createMatchMedia from '../helpers/createMatchMedia';
import isAccessible from '../utils/axe';

// TODO: Fix accessibility issues with this component
it.skip('should be accessible', () => {
  isAccessible(
    render(
      <BrowserRouter>
        <CivicProfile />
      </BrowserRouter>
    )
  );
});

it('renders page container flex direction as row and nav container width as 25% by default', () => {
  const component = render(
    <BrowserRouter>
      <CivicProfile />
    </BrowserRouter>
  );

  const componentContainer = component.container.firstChild;
  const navContainer = componentContainer.firstChild;

  const componentContainerStyles = getComputedStyle(componentContainer);
  const navContainerStyles = getComputedStyle(navContainer);

  expect(componentContainerStyles.flexDirection).toBe('row');
  expect(navContainerStyles.width).toBe('25%');
});

it('renders page container flex direction as column and nav container width as 100% below 600px', () => {
  window.matchMedia = createMatchMedia(599);
  const component = render(
    <BrowserRouter>
      <CivicProfile />
    </BrowserRouter>
  );

  const componentContainer = component.container.firstChild;
  const navContainer = componentContainer.firstChild;

  const componentContainerStyles = getComputedStyle(componentContainer);
  const navContainerStyles = getComputedStyle(navContainer);

  expect(componentContainerStyles.flexDirection).toBe('column');
  expect(navContainerStyles.width).toBe('100%');
});
