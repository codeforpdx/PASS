import React from 'react';
import { render } from '@testing-library/react';
import { vi, expect, it, describe } from 'vitest';
import { BasicInfo } from '@components/CivicProfileForms';
import { useCivicProfile } from '@hooks';
import userEvent from '@testing-library/user-event';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useCivicProfile: vi.fn()
  };
});

describe('Basic info form', () => {
  it('renders', () => {
    useCivicProfile.mockReturnValue({ data: {}, isSuccess: true });
    const { getByRole } = render(<BasicInfo />);
    const firstNameField = getByRole('textbox', { name: 'Legal first name' });
    expect(firstNameField).not.toBeNull();
  });

  it('Submits a basic info profile update when you click the submit button', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn();
    const basicInfoProfile = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-12-15',
      gender: 'Male'
    };
    useCivicProfile.mockReturnValue({ add: mockAdd, isSuccess: true });
    const { getByRole } = render(<BasicInfo />);
    const firstNameField = getByRole('textbox', { name: 'Legal first name' });
    const lastNameField = getByRole('textbox', { name: 'Legal last name' });
    const dateOfBirthField = getByRole('textbox', { name: 'Choose date' });
    const genderField = getByRole('combobox', { name: 'Gender' });
    const submitButton = getByRole('button', { name: 'Submit button' });
    await user.type(firstNameField, basicInfoProfile.firstName);
    await user.type(lastNameField, basicInfoProfile.lastName);
    await user.type(dateOfBirthField, basicInfoProfile.dateOfBirth);
    await user.type(genderField, `${basicInfoProfile.gender}{enter}`);
    await user.click(submitButton);
    expect(mockAdd).toBeCalledWith(basicInfoProfile);
  });
});
