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
    const firstNameField = getByRole('input', { name: 'First Name:' });
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
    const firstNameField = getByRole('textbox', { name: 'Legal First Name' });
    const lastNameField = getByRole('textbox', { name: 'Legal Last Name' });
    const dateOfBirthField = getByRole('textbox', { name: 'Date of Birth' });
    const genderField = getByRole('textbox', { name: 'Gender' });
    const submitButton = getByRole('button');
    await user.type(firstNameField, basicInfoProfile.firstName);
    await user.type(lastNameField, basicInfoProfile.lastName);
    await user.type(dateOfBirthField, basicInfoProfile.dateOfBirth);
    await user.type(genderField, basicInfoProfile.gender);
    await user.click(submitButton);
    expect(mockAdd).toBeCalledWith(basicInfoProfile);
  });
});
