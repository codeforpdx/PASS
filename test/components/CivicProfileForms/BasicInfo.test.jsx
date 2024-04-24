import React from 'react';
import { render } from '@testing-library/react';
import { vi, expect, it, describe } from 'vitest';
import { BasicInfo } from '@components/CivicProfileForms';
import { useCivicProfile } from '@hooks';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useCivicProfile: vi.fn()
  };
});

describe('Basic info form', () => {
  it('renders', () => {
    useCivicProfile.mockReturnValue({ data: {}, isSuccess: true, refetch: vi.fn() });
    const { getByRole } = render(<BasicInfo />);
    const legalFirstName = getByRole('textbox', { name: 'Legal first name' });
    expect(legalFirstName).not.toBeNull();
  });

  // TODO: Resolve test not passing
  // it('clears all input fields when you click the clear button', async () => {
  //   const mockClear = vi.fn();
  //   const basicInfoProfile = {
  //     legalFirstName: 'Jane',
  //     legalLastName: 'Doe',
  //     legalDOB: '1980-12-15',
  //     legalGender: 1
  //   };
  //   useCivicProfile.mockReturnValue({
  //     add: mockClear,
  //     isSuccess: true,
  //     storedDataset: {},
  //     refetch: vi.fn()
  //   });
  //   const { getByRole } = render(<BasicInfo />);
  //   const legalFirstName = getByRole('textbox', { name: 'Legal first name' });
  //   const legalLastName = getByRole('textbox', { name: 'Legal last name' });
  //   const legalDOB = getByRole('textbox', { name: 'Choose date' });
  //   const legalGender = getByRole('combobox', { name: 'Gender' });
  //   const clearButton = getByRole('button', { name: 'Clear button' });

  //   await userEvent.type(legalFirstName, basicInfoProfile.legalFirstName);
  //   await userEvent.type(legalLastName, basicInfoProfile.legalLastName);
  //   await userEvent.type(legalDOB, basicInfoProfile.legalDOB);
  //   await userEvent.type(legalGender, `${basicInfoProfile.legalGender}{enter}`);

  //   await userEvent.click(clearButton);

  //   expect(legalFirstName.value).toBe('');
  //   expect(legalLastName.value).toBe('');
  //   expect(legalDOB.value).toBe(null);
  //   expect(legalGender.value).toBe('');
  // });

  // TODO: Resolve test not passing
  // it('submits a basic info profile update when you click the submit button', async () => {
  //   const user = userEvent.setup();
  //   const mockAdd = vi.fn();
  //   const basicInfoProfile = {
  //     legalFirstName: 'Jane',
  //     legalLastName: 'Doe',
  //     legalDOB: '1980-12-15',
  //     legalGender: 1
  //   };
  //   useCivicProfile.mockReturnValue({ add: mockAdd, isSuccess: true });
  //   const { getByRole } = render(<BasicInfo />);
  //   const legalFirstName = getByRole('textbox', { name: 'Legal first name' });
  //   const legalLastName = getByRole('textbox', { name: 'Legal last name' });
  //   const legalDOB = getByRole('textbox', { name: 'Choose date' });
  //   const legalGender = getByRole('combobox', { name: 'Gender' });
  //   const submitButton = getByRole('button', { name: 'Submit button' });
  //   await user.type(legalFirstName, basicInfoProfile.legalFirstName);
  //   await user.type(legalLastName, basicInfoProfile.legalLastName);
  //   await user.type(legalDOB, basicInfoProfile.legalDOB);
  //   await user.type(legalGender, `${basicInfoProfile.legalGender}{enter}`);
  //   await user.click(submitButton);
  //   expect(mockAdd).toBeCalledWith(basicInfoProfile);
  // });
});
