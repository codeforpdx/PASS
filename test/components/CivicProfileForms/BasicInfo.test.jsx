import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { vi, expect, it, describe } from 'vitest';
import { BasicInfo } from '@components/CivicProfileForms';
import { useCivicProfile, useNotification } from '@hooks';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import dayjs from 'dayjs';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useCivicProfile: vi.fn(),
    useNotification: vi.fn()
  };
});

describe('Basic info form', () => {
  it('renders', () => {
    useCivicProfile.mockReturnValue({ data: {}, isSuccess: true, refetch: vi.fn() });
    useNotification.mockReturnValue({ addNotification: vi.fn() });

    const { getByRole } = render(<BasicInfo />);
    const legalFirstName = getByRole('textbox', { name: 'Legal first name' });
    expect(legalFirstName).not.toBeNull();
  });

  it('clears all input fields when you click the clear button', async () => {
    const user = userEvent.setup();
    const mockClear = vi.fn();
    const basicInfoProfile = {
      legalFirstName: 'Jane',
      legalLastName: 'Doe',
      legalDOB: Date.now(),
      legalGender: 1
    };
    useCivicProfile.mockReturnValue({
      add: mockClear,
      isSuccess: true,
      storedDataset: {},
      refetch: vi.fn()
    });
    useNotification.mockReturnValue({ addNotification: vi.fn() });

    const { getByRole } = render(<BasicInfo />);
    const legalFirstName = getByRole('textbox', { name: 'Legal first name' });
    const legalLastName = getByRole('textbox', { name: 'Legal last name' });
    const legalDOB = getByRole('textbox', { name: 'Choose date' });
    const legalGender = getByRole('combobox', { name: 'Gender' });
    const clearButton = getByRole('button', { name: 'Clear button' });

    await user.type(legalFirstName, basicInfoProfile.legalFirstName);
    await user.type(legalLastName, basicInfoProfile.legalLastName);
    await user.type(legalDOB, `{enter}`);
    await user.click(legalGender);
    const listBox = within(getByRole('listbox'));
    user.click(listBox.getByText('Female'));

    await user.click(clearButton);

    expect(legalFirstName.value).toBe('');
    expect(legalLastName.value).toBe('');
    expect(legalDOB.value).toBe('');
    expect(await screen.findByText(/Decline to answer/i)).toBeInTheDocument();
  });

  it('submits a basic info profile update when you click the submit button', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn();
    const basicInfoProfile = {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: dayjs(Date.now()).toDate(),
      gender: 1
    };
    const basicInfoTransformed = {
      ...basicInfoProfile,
      dateOfBirth: dayjs(
        `${basicInfoProfile.dateOfBirth.getFullYear()}-${
          basicInfoProfile.dateOfBirth.getMonth() + 1
        }-${basicInfoProfile.dateOfBirth.getDate()}`
      ).toDate()
    };

    useCivicProfile.mockReturnValue({
      add: mockAdd,
      isSuccess: true,
      storedDataset: {},
      refetch: vi.fn()
    });
    useNotification.mockReturnValue({ addNotification: vi.fn() });

    const { getByRole } = render(<BasicInfo />);
    const legalFirstName = getByRole('textbox', { name: 'Legal first name' });
    const legalLastName = getByRole('textbox', { name: 'Legal last name' });
    const legalDOB = getByRole('textbox', { name: 'Choose date' });
    const legalGender = getByRole('combobox', { name: 'Gender' });
    const submitButton = getByRole('button', { name: 'Submit button' });

    await user.type(legalFirstName, basicInfoProfile.firstName);
    await user.type(legalLastName, basicInfoProfile.lastName);
    await user.type(legalDOB, `{enter}`);
    await user.click(legalGender);
    await user.click(screen.getByRole('option', { name: 'Male' }));
    await user.click(submitButton);

    expect(mockAdd).toBeCalledWith(basicInfoTransformed);
  });
});
