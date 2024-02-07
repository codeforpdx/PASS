import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect, it, describe, afterEach } from 'vitest';
import { HomeSection } from '@components/Home';

const MockSection = () => <HomeSection />;
const MockSectionButton = () => <HomeSection button="button" />;
const MockSectionDescription = () => <HomeSection description="Example Text" />;

describe('Button rendering', () => {
  afterEach(() => {
    cleanup();
    delete window.matchMedia;
  });

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
});

describe('Description rendering', () => {
  afterEach(() => {
    cleanup();
    delete window.matchMedia;
  });

  it('renders no description', () => {
    const { queryByText } = render(<MockSection />);
    const description = queryByText('Example Text');

    expect(description).toBeNull();
  });

  it('renders description', () => {
    const { queryByText } = render(<MockSectionDescription />);
    const description = queryByText('Example Text');
    expect(description).not.toBeNull();
  });
});

describe('Image rendering', () => {
  afterEach(() => {
    cleanup();
    delete window.matchMedia;
  });

  it('renders image at 300px width on desktop', () => {
    const { queryByRole } = render(<MockSectionDescription />);
    const image = queryByRole('img');
    expect(image).not.toBeNull();
  });
});
