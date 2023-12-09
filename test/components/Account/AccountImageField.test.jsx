import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccountImageField } from '@components/Account';
import '@testing-library/jest-dom/extend-expect';

const MockAccountComponent = ({ noUserImage, mockContactProfile }) => {
  if (!noUserImage) {
    localStorage.setItem('profileImage', 'https://example.com/user.png');
  }
  return <AccountImageField contactProfile={mockContactProfile} />;
};

describe('AccountImageField', () => {
  it('renders Choose Img button and PersonIcon if contactProfile is null and user has no account image', () => {
    const { queryByRole, queryByTestId } = render(
      <MockAccountComponent noUserImage mockContactProfile={null} />
    );
    const buttonElement = queryByRole('button');
    expect(buttonElement.textContent).toBe('Choose Img');

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).not.toBeNull();
  });

  it('renders Remove Img button and image if contactProfile is null, but user has account image', () => {
    const { queryByRole, queryByTestId } = render(
      <MockAccountComponent mockContactProfile={null} />
    );
    const buttonElement = queryByRole('button');
    expect(buttonElement.textContent).toBe('Remove Img');

    const muiAvatar = queryByRole('img');
    expect(muiAvatar).toHaveAttribute('src', 'https://example.com/user.png');

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).toBeNull();
  });

  it('renders no button with PersonIcon if contactProfile is not null and has no account image', () => {
    const { queryByRole, queryByTestId } = render(<MockAccountComponent mockContactProfile={{}} />);
    const buttonElement = queryByRole('button');
    expect(buttonElement).toBeNull();

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).not.toBeNull();
  });

  it('renders no button with image if contactProfile is not null and has account image', () => {
    const mockContactProfile = { profileImage: 'https://example.com/client.png' };
    const { queryByRole, queryByTestId } = render(
      <MockAccountComponent mockContactProfile={mockContactProfile} />
    );
    const buttonElement = queryByRole('button');
    expect(buttonElement).toBeNull();

    const muiAvatar = queryByRole('img');
    expect(muiAvatar).toHaveAttribute('src', 'https://example.com/client.png');

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).toBeNull();
  });
});
