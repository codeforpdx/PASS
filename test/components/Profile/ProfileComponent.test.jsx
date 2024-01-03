import React from 'react';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProfileComponent } from '@components/Profile';
import { SignedInUserContext } from '@contexts';
import * as profileHelper from '../../../src/model-helpers/Profile';
import '@testing-library/jest-dom/extend-expect';
import createMatchMedia from '../../helpers/createMatchMedia';
import isAccessible from '../../utils/axe';

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

  // These are set to async/await so that they don't conflict with each other.
  // `axe` requires synchronous execution, so if multiple are running at once,
  // it can give false positives.
  // TODO: Fix accessibility issues with this component
  it.skip('should be accessible', async () => {
    await isAccessible(
      render(
        <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
          <ProfileComponent contactProfile={null} />
        </SignedInUserContext.Provider>
      )
    );
  });

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

it('renders profile component as row default', () => {
  const component = render(
    <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
      <ProfileComponent contactProfile={null} />
    </SignedInUserContext.Provider>
  );

  const container = component.container.firstChild;
  const cssProperty = getComputedStyle(container);

  expect(cssProperty.flexDirection).toBe('row');
});

// TODO: Fix accessibility issues with this component
it.skip('should be accessible on mobile', async () => {
  window.matchMedia = createMatchMedia(599);
  await isAccessible(
    render(
      <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
        <ProfileComponent contactProfile={null} />
      </SignedInUserContext.Provider>
    )
  );
});

it('renders profile component as column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const component = render(
    <SignedInUserContext.Provider value={mockSignedInUserContextMemo}>
      <ProfileComponent contactProfile={null} />
    </SignedInUserContext.Provider>
  );

  const container = component.container.firstChild;
  const cssProperty = getComputedStyle(container);

  expect(cssProperty.flexDirection).toBe('column');
});
