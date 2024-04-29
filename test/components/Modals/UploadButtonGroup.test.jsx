import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import UploadButtonGroup from '../../../src/components/Modals/UploadButtonGroup';
/* eslint-disable no-unused-expressions */
// mock camera availability
const mockEnumerateDevices = (available) => {
  global.navigator.mediaDevices = {
    enumerateDevices: vi.fn(() => Promise.resolve(available ? [{ kind: 'videoinput' }] : []))
  };
};

describe('UploadButtonGroup Component', () => {
  it('renders only three buttons', () => {
    global.innerWidth = 1024;
    const { getAllByRole } = render(<UploadButtonGroup />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  it('renders use webcam button when webcam exists', async () => {
    mockEnumerateDevices(true);
    const { findByText } = render(<UploadButtonGroup />);

    const webcamButton = await findByText('Take Photos');
    expect(webcamButton).to.be.ok;
  });

  it('render capture image when webcam doesnt exist', async () => {
    mockEnumerateDevices(false);
    const { findByText } = render(<UploadButtonGroup />);

    const captureImageButton = await findByText('Capture image');
    // eslint-disable-next-line no-unused-expressions
    expect(captureImageButton).to.be.ok;
  });
});
/* eslint-enable no-unused-expressions */
