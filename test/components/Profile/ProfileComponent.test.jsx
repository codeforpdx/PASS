import React from 'react';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProfileComponent } from '@components/Profile';
import { SignedInUserContext } from '@contexts';
import * as profileHelper from '../../../src/model-helpers/Profile';
import '@testing-library/jest-dom/extend-expect';

const profileInfo = {
  profileName: null,
  nickname: null,
  profileImg: null
};

const mockSignedInUserContextMemo = {
  updateProfileInfo: vi.fn(),
  setProfileData: vi.fn(),
  profileData: {
    profileInfo
  },
  fetchProfileInfo: vi
    .spyOn(profileHelper, 'fetchProfileInfo')
    .mockResolvedValue({ profileData: profileInfo })
};

const MockProfileComponent = ({ mockClientProfile }) => (
  <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
    <ProfileComponent clientProfile={mockClientProfile} />
  </SignedInUserContext.Provider>
);

describe('ProfileComponent', () => {
  afterEach(() => cleanup());

  it('renders edit button for ProfileInputFields when clientProfile is null', () => {
    const { queryByRole } = render(<MockProfileComponent mockClientProfile={null} />);
    const editButton = queryByRole('button', { name: 'Edit' });

    expect(editButton).not.toBeNull();
  });

  it('renders cancel and update buttons after clicking on edit button', async () => {
    const { queryByRole } = render(<MockProfileComponent mockClientProfile={null} />);
    let editButton = queryByRole('button', { name: 'Edit' });

    const user = userEvent.setup();
    await user.click(editButton);

    const cancelButton = queryByRole('button', { name: 'Cancel' });
    const updateButton = queryByRole('button', { name: 'Update' });

    expect(cancelButton).not.toBeNull();
    expect(updateButton).not.toBeNull();

    editButton = queryByRole('button', { name: 'Edit' });
    expect(editButton).toBeNull();
  });

  it('renders edit buttons after clicking on cancel button', async () => {
    const { queryByRole } = render(<MockProfileComponent mockClientProfile={null} />);
    let editButton = queryByRole('button', { name: 'Edit' });
    let cancelButton;

    const user = userEvent.setup();
    await user.click(editButton);

    cancelButton = queryByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    editButton = queryByRole('button', { name: 'Edit' });
    expect(editButton).not.toBeNull();

    cancelButton = queryByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeNull();
  });

  it('renders no edit button for ProfileInputFields in clientProfile is not null', () => {
    const { queryByRole } = render(<MockProfileComponent mockClientProfile={{}} />);
    const editButton = queryByRole('button', { name: 'Edit' });

    expect(editButton).toBeNull();
  });
});
