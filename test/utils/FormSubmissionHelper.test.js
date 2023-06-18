import { afterEach, beforeEach, vi, expect, it, describe } from 'vitest';
import dayjs from 'dayjs';
import {
  makeHandleFormSubmission,
  runNotification,
  uploadDocument,
  updateDocument
} from '../../src/utils';
import { INTERACTION_TYPES } from '../../src/constants';

vi.mock('../../src/utils/network/session-core', () => ({
  updateDocument: vi.fn(),
  uploadDocument: vi.fn()
}));

vi.mock('../../src/utils/frontend/notification-helper', () => ({
  default: vi.fn()
}));

describe('FormSubmissionHelper', async () => {
  const sessionMock = {};
  const clearInputFieldsMock = vi.fn();
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Validations', () => {
    const stateMock = {
      file: null
    };
    const mockHandleSubmit = makeHandleFormSubmission(
      INTERACTION_TYPES.SELF,
      dayjs('2010-10-01'),
      'No Description Provided',
      stateMock,
      dispatchMock,
      sessionMock,
      clearInputFieldsMock
    );

    it("autoquits when there's no file to upload", async () => {
      const event = {
        preventDefault: vi.fn()
      };

      await mockHandleSubmit(event);
      expect(runNotification).toBeCalledWith(
        'Submission failed. Reason: missing file',
        5,
        stateMock,
        dispatchMock
      );
    });
  });

  describe('Networking', () => {
    const stateMock = {
      file: {
        name: 'mock'
      }
    };
    const mockHandleSubmit = makeHandleFormSubmission(
      INTERACTION_TYPES.SELF,
      dayjs('2010-10-01'),
      'No Description Provided',
      stateMock,
      dispatchMock,
      sessionMock,
      clearInputFieldsMock
    );

    const event = {
      preventDefault: vi.fn(),
      target: {
        document: {
          value: 'mock'
        },
        date: {
          value: 'mock'
        },
        description: {
          value: 'mock'
        }
      }
    };

    it('calls uploadDocument to upload', async () => {
      await mockHandleSubmit(event);
      expect(uploadDocument).toBeCalled();
      expect(updateDocument).toBeCalledTimes(0);
    });

    it('tries to update a document when upload fails', async () => {
      uploadDocument.mockRejectedValueOnce(new Error('Mock error message'));

      await mockHandleSubmit(event);
      expect(updateDocument).toBeCalledTimes(1);
    });

    it('Notifies the user when both upload and update fail', async () => {
      uploadDocument.mockRejectedValueOnce(new Error('Mock error message'));
      updateDocument.mockRejectedValueOnce(new Error('Mock error message'));

      await mockHandleSubmit(event);
      expect(runNotification).toBeCalledWith(
        `Operation failed. Reason: Mock error message`,
        5,
        stateMock,
        dispatchMock
      );
    });
  });
});
