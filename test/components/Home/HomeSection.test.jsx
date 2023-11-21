import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { HomeSection } from '@components/Home';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockSection = () => <HomeSection description="Example Text" />;
const MockSectionMobile = () => <HomeSection isReallySmallScreen description="Example Text" />;
const MockSectionButton = () => <HomeSection button="button" />;
const MockSectionButtonMobile = () => <HomeSection isReallySmallScreen button="button" />;

describe('Button rendering', () => {
  it('renders no button', () => {
    const { queryByRole } = render(<MockSection />);
    const button = queryByRole('button');

    expect(button).toBeNull();
  });

  it('renders button', () => {
    const { queryByRole } = render(<MockSectionButton />);
    const button = queryByRole('button');
    const buttonStyles = getComputedStyle(button);

    expect(button).not.toBeNull();
    expect(buttonStyles.width).toBe('25%');
  });

  it('renders button mobile', () => {
    window.matchMedia = createMatchMedia(599);
    const { queryByRole } = render(<MockSectionButtonMobile />);
    const button = queryByRole('button');
    const buttonStyles = getComputedStyle(button);

    expect(button).not.toBeNull();
    expect(buttonStyles.width).toBe('100%');
  });
});

describe('Default screen', () => {
  it('renders 300px padding by default', () => {
    render(<MockSection />);
    const image = getComputedStyle(screen.getByRole('img'));

    expect(image.width).toBe('300px');
  });

  it('renders 85% padding by default', () => {
    render(<MockSection />);
    const description = screen.getByText('Example Text');
    const descriptionStyles = getComputedStyle(description);

    expect(descriptionStyles.width).toBe('85%');
  });
});

describe('Mobile screen', () => {
  window.matchMedia = createMatchMedia(599);
  it('renders 80% padding by default', () => {
    render(<MockSectionMobile />);
    const image = getComputedStyle(screen.getByRole('img'));

    expect(image.width).toBe('80%');
  });

  it('renders 100% padding by default', () => {
    const { getByText } = render(<MockSectionMobile />);
    const description = getByText('Example Text');
    const descriptionStyles = getComputedStyle(description);

    expect(descriptionStyles.width).toBe('100%');
  });
});
