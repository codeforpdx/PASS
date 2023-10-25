import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, beforeEach, afterEach, vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import BasicNotification from '../../../src/components/Notification/BasicNotification';
import { NotificationContext } from '../../../src/contexts/NotificationContext';

it('renders correctly', () => {
  const message = 'my test message';
  render(
    <BasicNotification severity="success" message={message} id={123456} dataTestId="test-id" />
  );

  const notification = screen.getByRole('alert');
  expect(notification.textContent).toBe(message);
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('calls remove after 8 seconds', () => {
  const remove = vi.fn();

  render(
    <NotificationContext.Provider value={{ remove }}>
      <BasicNotification
        severity="success"
        message="my test message"
        id={123456}
        dataTestId="test-id"
      />
    </NotificationContext.Provider>
  );

  act(() => {
    vi.advanceTimersByTime(8000);
  });

  expect(remove).toHaveBeenCalledOnce();
});

it('calls remove with the correct id', () => {
  const remove = vi.fn();

  render(
    <NotificationContext.Provider value={{ remove }}>
      <BasicNotification
        severity="success"
        message="my test message"
        id={123456}
        dataTestId="test-id"
      />
    </NotificationContext.Provider>
  );

  act(() => {
    vi.advanceTimersByTime(8000);
  });

  expect(remove).toHaveBeenCalledWith(123456);
});
