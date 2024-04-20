import React from 'react';
import { render } from '@testing-library/react';
import { vi, expect, it, describe } from 'vitest';
import { HousingInfo } from '@components/ProfileForms';
import { useProfile } from '@hooks';
import userEvent from '@testing-library/user-event';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useProfile: vi.fn()
  };
});

describe('Housing info form', () => {
  it('renders', () => {
    useProfile.mockReturnValue({ data: {}, isSuccess: true, refetch: vi.fn() });
    const { getByRole } = render(<HousingInfo />);
    const cityField = getByRole('textbox', { name: 'City:' });
    expect(cityField).not.toBeNull();
  });

  it('submits an address update when you click the submit button', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn();
    const address = {
      lastPermanentCity: 'Portland',
      lastPermanentStreet: '20th ave',
      lastPermanentState: 'Oregon',
      lastPermanentZIP: '97205'
    };
    useProfile.mockReturnValue({
      add: mockAdd,
      isSuccess: true,
      storedDataset: {},
      refetch: vi.fn()
    });
    const { getByRole } = render(<HousingInfo />);
    const cityField = getByRole('textbox', { name: 'City:' });
    const streetField = getByRole('textbox', { name: 'Street:' });
    const stateField = getByRole('textbox', { name: 'State:' });
    const zipField = getByRole('textbox', { name: 'ZIP Code:' });
    const submitButton = getByRole('button');
    await user.type(cityField, address.lastPermanentCity);
    await user.type(streetField, address.lastPermanentStreet);
    await user.type(stateField, address.lastPermanentState);
    await user.type(zipField, address.lastPermanentZIP);
    await user.click(submitButton);
    expect(mockAdd).toBeCalledWith(address);
  });
  it('does not submit when storedDataset is null', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn();
    const address = {
      lastPermanentCity: 'Portland',
      lastPermanentStreet: '20th ave',
      lastPermanentState: 'Oregon',
      lastPermanentZIP: '97205'
    };
    useProfile.mockReturnValue({
      add: mockAdd,
      isSuccess: true,
      storedDataset: null,
      refetch: vi.fn()
    });
    const { getByRole } = render(<HousingInfo />);
    const cityField = getByRole('textbox', { name: 'City:' });
    const streetField = getByRole('textbox', { name: 'Street:' });
    const stateField = getByRole('textbox', { name: 'State:' });
    const zipField = getByRole('textbox', { name: 'ZIP Code:' });
    const submitButton = getByRole('button');
    await user.type(cityField, address.lastPermanentCity);
    await user.type(streetField, address.lastPermanentStreet);
    await user.type(stateField, address.lastPermanentState);
    await user.type(zipField, address.lastPermanentZIP);
    await user.click(submitButton);
    expect(mockAdd).not.toBeCalled();
  });
});
