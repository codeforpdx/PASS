import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, expect, it, describe } from 'vitest';
import { HousingInfo } from '@components/CivicProfileForms';
import { useCivicProfile, useNotification } from '@hooks';
import userEvent from '@testing-library/user-event';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useCivicProfile: vi.fn(),
    useNotification: vi.fn()
  };
});

describe('Housing info form', () => {
  it('renders', () => {
    useCivicProfile.mockReturnValue({ data: {}, isSuccess: true, refetch: vi.fn() });
    useNotification.mockReturnValue({ addNotification: vi.fn() });
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
    useNotification.mockReturnValue({ addNotification: vi.fn() });
    const { getByRole } = render(<HousingInfo />);
    const cityField = getByRole('textbox', { name: 'City:' });
    const streetField = getByRole('textbox', { name: 'Street:' });
    const stateField = getByRole('textbox', { name: 'State:' });
    const zipField = getByRole('textbox', { name: 'ZIP Code:' });
    const monthsHomelessField = getByRole('combobox', { name: 'Months Houseless Past 3 Years:' });
    const timesHomelessField = getByRole('combobox', {
      name: 'Number of Times Houseless Past 3 Years:'
    });
    const timeToHousingLossField = getByRole('combobox', { name: 'Time Until Loss of Housing:' });
    const submitButton = getByRole('button', { name: 'Submit button' });
    await user.type(cityField, address.lastPermanentCity);
    await user.type(streetField, address.lastPermanentStreet);
    await user.type(stateField, address.lastPermanentState);
    await user.type(zipField, address.lastPermanentZIP);
    await user.click(monthsHomelessField);
    await user.click(screen.getByRole('option', { name: address.monthsHomeless }));
    await user.click(timesHomelessField);
    await user.click(screen.getByRole('option', { name: address.timesHomeless }));
    await user.click(timeToHousingLossField);
    await user.click(screen.getByRole('option', { name: address.timeToHousingLoss }));
    await user.click(submitButton);

    expect(mockAdd).toBeCalledWith({
      ...address,
      monthsHomeless: 103,
      timeToHousingLoss: 1,
      timesHomeless: 2
    });
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
    const monthsHomelessField = getByRole('combobox', { name: 'Months Houseless Past 3 Years:' });
    const timesHomelessField = getByRole('combobox', {
      name: 'Number of Times Houseless Past 3 Years:'
    });
    const timeToHousingLossField = getByRole('combobox', { name: 'Time Until Loss of Housing:' });
    const submitButton = getByRole('button', { name: 'Submit button' });
    await user.type(cityField, address.lastPermanentCity);
    await user.type(streetField, address.lastPermanentStreet);
    await user.type(stateField, address.lastPermanentState);
    await user.type(zipField, address.lastPermanentZIP);
    await user.click(monthsHomelessField);
    await user.click(screen.getByRole('option', { name: address.monthsHomeless }));
    await user.click(timesHomelessField);
    await user.click(screen.getByRole('option', { name: address.timesHomeless }));
    await user.click(timeToHousingLossField);
    await user.click(screen.getByRole('option', { name: address.timeToHousingLoss }));
    await user.click(submitButton);

    expect(mockAdd).not.toBeCalled();
  });

  it('clears all input fields when you click the clear button', async () => {
    const user = userEvent.setup();
    const mockClear = vi.fn();
    const address = {
      lastPermanentStreet: '20th ave',
      lastPermanentCity: 'Portland',
      lastPermanentState: 'Oregon',
      lastPermanentZIP: '97205',
      monthsHomeless: '1 Month',
      timesHomeless: 'One Time',
      timeToHousingLoss: '7-13 Days'
    };
    useCivicProfile.mockReturnValue({
      add: mockClear,
      isSuccess: true,
      storedDataset: {},
      refetch: vi.fn()
    });

    useNotification.mockReturnValue({ addNotification: vi.fn() });
    const { getByRole } = render(<HousingInfo />);
    const cityField = getByRole('textbox', { name: 'City:' });
    const streetField = getByRole('textbox', { name: 'Street:' });
    const stateField = getByRole('textbox', { name: 'State:' });
    const zipField = getByRole('textbox', { name: 'ZIP Code:' });
    const monthsHomelessField = getByRole('combobox', { name: 'Months Houseless Past 3 Years:' });
    const timesHomelessField = getByRole('combobox', {
      name: 'Number of Times Houseless Past 3 Years:'
    });
    const timeToHousingLossField = getByRole('combobox', { name: 'Time Until Loss of Housing:' });
    const clearButton = getByRole('button', { name: 'Clear button' });

    await user.type(streetField, address.lastPermanentStreet);
    await user.type(cityField, address.lastPermanentCity);
    await user.type(stateField, address.lastPermanentState);
    await user.type(zipField, address.lastPermanentZIP);
    await user.click(monthsHomelessField);
    await user.click(screen.getByRole('option', { name: address.monthsHomeless }));
    await user.click(timesHomelessField);
    await user.click(screen.getByRole('option', { name: address.timesHomeless }));
    await user.click(timeToHousingLossField);
    await user.click(screen.getByRole('option', { name: address.timeToHousingLoss }));

    await user.click(clearButton);

    expect(streetField.value).toBe('');
    expect(cityField.value).toBe('');
    expect(stateField.value).toBe('');
    expect(zipField.value).toBe('');
    expect(monthsHomelessField.firstChild.textContent).toBe('Data not collected');
    expect(timesHomelessField.firstChild.textContent).toBe('Data not collected');
    expect(timeToHousingLossField.firstChild.textContent).toBe('Data not collected');
  });
});


