import React from 'react';
import { render } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { HomeSection } from '@components/Home';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockSection = () => <HomeSection />;
const MockSectionDescription = () => <HomeSection description="Example Text" />;
const MockSectionDescriptionMobile = () => (
  <HomeSection isReallySmallScreen description="Example Text" />
);
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
    expect(buttonStyles.width).not.toBe('100%');
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

describe('Description rendering', () => {
  it('renders no description', () => {
    const { queryByText } = render(<MockSection />);
    const description = queryByText('Example Text');

    expect(description).toBeNull();
  });

  it('renders description', () => {
    const { queryByText } = render(<MockSectionDescription />);
    const description = queryByText('Example Text');
    const descriptionStyles = getComputedStyle(description);

    expect(descriptionStyles.width).not.toBe('100%');
  });

  it('renders description mobile', () => {
    window.matchMedia = createMatchMedia(599);
    const { queryByText } = render(<MockSectionDescriptionMobile />);
    const description = queryByText('Example Text');
    const descriptionStyles = getComputedStyle(description);

    expect(descriptionStyles.width).toBe('100%');
  });
});

describe('Image rendering', () => {
  it('renders image at 300px width on desktop', () => {
    const { queryByRole } = render(<MockSectionDescription />);
    const image = getComputedStyle(queryByRole('img'));

    expect(image.width).toBe('300px');
  });

  it('renders image at 80% width on mobile', () => {
    window.matchMedia = createMatchMedia(599);
    const { queryByRole } = render(<MockSectionDescriptionMobile />);
    const image = getComputedStyle(queryByRole('img'));

    expect(image.width).toBe('80%');
  });
});
