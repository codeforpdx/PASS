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

// beforeEach(() => {
//   vi.useFakeTimers();
// });

// afterEach(() => {
//   vi.useRealTimers();
// });

// it('is deleted after 8 seconds', () => {
//   const remove = vi.fn();

//   render(
//     <NotificationContext.Provider value={{ dispatch }}>
//       <BasicNotification
//         severity="success"
//         message="my test message"
//         id={123456}
//         dataTestId="test-id"
//       />
//     </NotificationContext.Provider>
//   );

//   vi.advanceTimersByTime(8000);

//   expect(screen.getByText('my test message')).toBeNull();
// });
