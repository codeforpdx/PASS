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
    profileInfo: {
      profileName: null,
      nickname: null,
      profileImg: null
    }
  },
  fetchProfileInfo: vi.spyOn(profileHelper, 'fetchProfileInfo').mockResolvedValue({
    profileData: profileInfo
  })
};

describe('ProfileComponent', () => {
  afterEach(() => cleanup());

  it('renders cancel and update buttons after clicking on edit button from initial render', async () => {
    const { queryByRole } = render(
      <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
        <ProfileComponent contactProfile={null} />
      </SignedInUserContext.Provider>
    );
    let editButton = queryByRole('button', { name: 'Edit' });
    expect(editButton).not.toBeNull();

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
    const { queryByRole } = render(
      <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
        <ProfileComponent contactProfile={null} />
      </SignedInUserContext.Provider>
    );
    let editButton = queryByRole('button', { name: 'Edit' });
    let cancelButton;
    let updateButton;

    const user = userEvent.setup();
    await user.click(editButton);

    updateButton = queryByRole('button', { name: 'Update' });
    cancelButton = queryByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    editButton = queryByRole('button', { name: 'Edit' });
    expect(editButton).not.toBeNull();

    updateButton = queryByRole('button', { name: 'Update' });
    expect(updateButton).toBeNull();

    cancelButton = queryByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeNull();
  });

  it('renders no edit button for ProfileInputFields if contactProfile is not null', () => {
    const { queryByRole } = render(
      <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
        <ProfileComponent contactProfile={{}} />
      </SignedInUserContext.Provider>
    );
    const editButton = queryByRole('button', { name: 'Edit' });

    expect(editButton).toBeNull();
  });
});
