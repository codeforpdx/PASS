import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import BasicNotification from '../../../src/components/Notification/BasicNotification';

it('renders correctly', () => {
  render(
    <BasicNotification
      severity="success"
      message="my test message"
      id={123456}
      dataTestId="test-id"
    />
  );

  expect(screen.getByText('my test message')).not.toBeNull();
});

// it('is deleted after the specified time', () => {});
