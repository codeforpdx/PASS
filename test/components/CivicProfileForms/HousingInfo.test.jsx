import React from 'react';
import { render } from '@testing-library/react';
import { vi, expect, it, describe } from 'vitest';
import { HousingInfo } from '@components/CivicProfileForms';
import { useCivicProfile } from '@hooks';
import userEvent from '@testing-library/user-event';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useCivicProfile: vi.fn()
  };
});

describe('Housing info form', () => {
  it('renders', () => {
    useCivicProfile.mockReturnValue({ data: {}, isSuccess: true, refetch: vi.fn() });
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
      lastPermanentZIP: '97205',
      monthsHomeless: '3 Months',
      timesHomeless: 'Two Times',
      timeToHousingLoss: '7-13 Days'
    };
    useCivicProfile.mockReturnValue({
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
    const monthsHomelessField = getByRole('option', { name: 'Months Houseless Past 3 Years:' });
    const timesHomelessField = getByRole('option', {
      name: 'Number of Times Houseless Past 3 Years:'
    });
    const timeToHousingLossField = getByRole('option', { name: 'Time Until Loss of Housing:' });
    const submitButton = getByRole('button', { name: 'Submit button' });
    const clearButton = getByRole('button', { name: 'Clear button' });
    await user.type(cityField, address.lastPermanentCity);
    await user.type(streetField, address.lastPermanentStreet);
    await user.type(stateField, address.lastPermanentState);
    await user.type(zipField, address.lastPermanentZIP);
    await user.type(monthsHomelessField, address.monthsHomeless);
    await user.type(timesHomelessField, address.timesHomeless);
    await user.type(timeToHousingLossField, address.timeToHousingLoss);
    await user.click(submitButton);
    await user.click(clearButton);
    expect(mockAdd).toBeCalledWith(address);
  });
  it('does not submit when storedDataset is null', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn();
    const address = {
      lastPermanentCity: 'Portland',
      lastPermanentStreet: '20th ave',
      lastPermanentState: 'Oregon',
      lastPermanentZIP: '97205',
      monthsHomeless: '1 Month',
      timesHomeless: 'One Time',
      timeToHousingLoss: '7-13 Days'
    };
    useCivicProfile.mockReturnValue({
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
    const monthsHomelessField = getByRole('option', { name: 'Months Houseless Past 3 Years:' });
    const timesHomelessField = getByRole('option', {
      name: 'Number of Times Houseless Past 3 Years:'
    });
    const timeToHousingLossField = getByRole('option', { name: 'Time Until Loss of Housing:' });
    const submitButton = getByRole('button', { name: 'Submit button' });
    const clearButton = getByRole('button', { name: 'Clear button' });
    await user.type(cityField, address.lastPermanentCity);
    await user.type(streetField, address.lastPermanentStreet);
    await user.type(stateField, address.lastPermanentState);
    await user.type(zipField, address.lastPermanentZIP);
    await user.type(monthsHomelessField, address.monthsHomeless);
    await user.type(timesHomelessField, address.timesHomeless);
    await user.type(timeToHousingLossField, address.timeToHousingLoss);
    await user.click(submitButton);
    await user.click(clearButton);
    expect(mockAdd).not.toBeCalled();
  });
});
