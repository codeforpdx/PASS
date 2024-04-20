import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccountImageField } from '../../../src/components/Account';
import '@testing-library/jest-dom/extend-expect';

const MockAccountComponent = ({ noUserImage, mockContactAccount }) => {
  if (!noUserImage) {
    localStorage.setItem('accountImage', 'https://example.com/user.png');
  }
  return <AccountImageField contactAccount={mockContactAccount} />;
};

describe('AccountImageField', () => {
  it('renders Choose Img button and PersonIcon if contactAccount is null and user has no profile img', () => {
    const { queryByRole, queryByTestId } = render(
      <MockAccountComponent noUserImage mockContactAccount={null} />
    );
    const buttonElement = queryByRole('button');
    expect(buttonElement.textContent).toBe('Choose Img');

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).not.toBeNull();
  });

  it('renders Remove Img button and image if contactAccount is null, but user has account image', () => {
    const { queryByRole, queryByTestId } = render(
      <MockAccountComponent mockContactAccount={null} />
    );
    const buttonElement = queryByRole('button');
    expect(buttonElement.textContent).toBe('Remove Img');

    const muiAvatar = queryByRole('img');
    expect(muiAvatar).toHaveAttribute('src', 'https://example.com/user.png');

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).toBeNull();
  });

  it('renders no button with PersonIcon if contactAccount is not null and has no account image', () => {
    const { queryByRole, queryByTestId } = render(<MockAccountComponent mockContactAccount={{}} />);
    const buttonElement = queryByRole('button');
    expect(buttonElement).toBeNull();

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).not.toBeNull();
  });

  it('renders no button with image if contactAccount is not null and has account image', () => {
    const mockContactAccount = { accountImage: 'https://example.com/client.png' };
    const { queryByRole, queryByTestId } = render(
      <MockAccountComponent mockContactAccount={mockContactAccount} />
    );
    const buttonElement = queryByRole('button');
    expect(buttonElement).toBeNull();

    const muiAvatar = queryByRole('img');
    expect(muiAvatar).toHaveAttribute('src', 'https://example.com/client.png');

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).toBeNull();
  });
});
