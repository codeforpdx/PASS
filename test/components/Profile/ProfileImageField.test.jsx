import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProfileImageField } from '../../../src/components/Profile';
import '@testing-library/jest-dom/extend-expect';

const MockProfileComponent = ({ noUserImage, mockContactProfile }) => {
  if (!noUserImage) {
    localStorage.setItem('profileImage', 'https://example.com/user.png');
  }
  return <ProfileImageField contactProfile={mockContactProfile} />;
};

describe('ProfileImageField', () => {
  it('renders PersonIcon if contactProfile is null and user has no profile image', () => {
    const { queryByTestId } = render(
      <MockProfileComponent noUserImage mockContactProfile={null} />
    );

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).not.toBeNull();
  });

  it('renders image if contactProfile is null but user has profile image', () => {
    const { queryByRole, queryByTestId } = render(
      <MockProfileComponent mockContactProfile={null} />
    );

    const muiAvatar = queryByRole('img');
    expect(muiAvatar).toHaveAttribute('src', 'https://example.com/user.png');

    const svgElement = queryByTestId('PersonIcon');
    expect(svgElement).toBeNull();
  });

  it('renders uploadProfilePictureIcon when user hovers over avatar with no profile image uploaded', () => {
    const mockContactProfile = { profileImage: 'https://example.com/client.png' };
    render(<MockProfileComponent noUserImage mockContactProfile={mockContactProfile} />);

    const avatar = screen.getByAltText('PASS profile');

    expect(screen.queryByTestId('uploadProfilePictureIcon')).not.toBeInTheDocument();

    fireEvent.mouseEnter(avatar);

    expect(screen.getByTestId('uploadProfilePictureIcon')).toBeInTheDocument();
  });

  // it('renders deleteProfilePictureIcon when user hovers over avatar with profile image uploaded', () => {
  //   render(<MockProfileComponent mockContactProfile={{}} />);

  //   const avatar = screen.getByAltText('PASS profile');

  //   expect(screen.queryByTestId('deleteProfilePictureIcon')).not.toBeInTheDocument();

  //   fireEvent.mouseEnter(avatar);

  //   expect(screen.getByTestId('deleteProfilePictureIcon')).toBeInTheDocument();
  // });

  //

  // it('renders Choose Img button and PersonIcon if contactProfile is null and user has no profile img', () => {
  //   const { queryByRole, queryByTestId } = render(
  //     <MockProfileComponent noUserImage mockContactProfile={null} />
  //   );
  //   const buttonElement = queryByRole('button');
  //   expect(buttonElement.textContent).toBe('Choose Img');

  //   const svgElement = queryByTestId('PersonIcon');
  //   expect(svgElement).not.toBeNull();
  // });

  // it('renders Remove Img button and image if contactProfile is null, but user has profile image', () => {
  //   const { queryByRole, queryByTestId } = render(
  //     <MockProfileComponent mockContactProfile={null} />
  //   );
  //   const buttonElement = queryByRole('button');
  //   expect(buttonElement.textContent).toBe('Remove Img');

  //   const muiAvatar = queryByRole('img');
  //   expect(muiAvatar).toHaveAttribute('src', 'https://example.com/user.png');

  //   const svgElement = queryByTestId('PersonIcon');
  //   expect(svgElement).toBeNull();
  // });

  // it('renders no button with PersonIcon if contactProfile is not null and has no profile image', () => {
  //   const { queryByRole, queryByTestId } = render(<MockProfileComponent mockContactProfile={{}} />);
  //   const buttonElement = queryByRole('button');
  //   expect(buttonElement).toBeNull();

  //   const svgElement = queryByTestId('PersonIcon');
  //   expect(svgElement).not.toBeNull();
  // });

  // it('renders no button with image if contactProfile is not null and has profile image', () => {
  //   const mockContactProfile = { profileImage: 'https://example.com/client.png' };
  //   const { queryByRole, queryByTestId } = render(
  //     <MockProfileComponent mockContactProfile={mockContactProfile} />
  //   );
  //   const buttonElement = queryByRole('button');
  //   expect(buttonElement).toBeNull();

  //   const muiAvatar = queryByRole('img');
  //   expect(muiAvatar).toHaveAttribute('src', 'https://example.com/client.png');

  //   const svgElement = queryByTestId('PersonIcon');
  //   expect(svgElement).toBeNull();
  // });
});
