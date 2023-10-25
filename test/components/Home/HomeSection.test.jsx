import React from 'react';
import { render } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { HomeSection } from '@components/Home';
import createMatchMedia from '../../test-helper/createMatchMedia';

const MockFormSectionDefault = () => <HomeSection description="Example Text" />;
const MockFormSectionMobile = () => <HomeSection isReallySmallScreen description="Example Text" />;
const MockFormSectionButton = () => <HomeSection button="button" />;
const MockFormSectionButtonMobile = () => <HomeSection isReallySmallScreen button="button" />;

describe('Button rendering', () => {
  it('renders no button', () => {
    const { queryByRole } = render(<MockFormSectionDefault />);
    const button = queryByRole('button');

    expect(button).toBeNull();
  });

  it('renders button', () => {
    const { queryByRole } = render(<MockFormSectionButton />);
    const button = queryByRole('button');
    const cssProperties = getComputedStyle(button);

    expect(button).not.toBeNull();
    expect(cssProperties.width).toBe('25%');
  });

  it('renders buttons mobile', () => {
    window.matchMedia = createMatchMedia(599);
    const { queryByRole } = render(<MockFormSectionButtonMobile />);
    const button = queryByRole('button');
    const cssProperties = getComputedStyle(button);

    expect(button).not.toBeNull();
    expect(cssProperties.width).toBe('100%');
  });
});

describe('Default screen', () => {
  it('renders 300px padding by default', () => {
    const component = render(<MockFormSectionDefault />);
    const adjustableBox = getComputedStyle(component.container.firstChild);

    expect(adjustableBox.width).toBe('300px');
  });

  it('renders 85% padding by default', () => {
    const { getByText } = render(<MockFormSectionDefault />);
    const descriptionElement = getByText('Example Text');
    const cssProperties = getComputedStyle(descriptionElement);

    expect(cssProperties.width).toBe('85%');
  });
});

describe('Mobile screen', () => {
  it('renders 80% padding by default', () => {
    window.matchMedia = createMatchMedia(599);
    const component = render(<MockFormSectionMobile />);
    const adjustableBox = getComputedStyle(component.container.firstChild);

    expect(adjustableBox.width).toBe('80%');
  });

  it('renders 100% padding by default', () => {
    window.matchMedia = createMatchMedia(599);
    const { getByText } = render(<MockFormSectionMobile />);
    const descriptionElement = getByText('Example Text');
    const cssProperties = getComputedStyle(descriptionElement);

    expect(cssProperties.width).toBe('100%');
  });
});
