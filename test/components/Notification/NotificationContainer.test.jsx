import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { NotificationContainer } from '../../../src/components/Notification';

const MockNotificationContainer = ({ notifications }) => (
  <BrowserRouter>
    <NotificationContainer notifications={notifications} />
  </BrowserRouter>
);

it('renders all the notifications from notification context', () => {
  const notifications = [
    { id: 34345, message: 'this is a success', severity: 'success' },
    { id: 45555, message: 'this is and error test', severity: 'error' },
    { id: 32235, message: 'this is an info test', severity: 'info' }
  ];

  render(<MockNotificationContainer notifications={notifications} />);
  const allNotifications = screen.getAllByTestId('noteTest');

  expect(allNotifications.length).toBe(3);
  expect(screen.getByText('this is a success')).not.toBeNull();
  expect(screen.getByText('this is and error test')).not.toBeNull();
  expect(screen.getByText('this is an info test')).not.toBeNull();
});
