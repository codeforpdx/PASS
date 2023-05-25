import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { expect, it, vi, afterEach, describe } from 'vitest';
import { ManageUsers } from '../../../src/components/Form';

const renderFormFields = () => {
  const { container, getByLabelText } = render(<ManageUsers />);

  return {
    container,
    firstNameField: getByLabelText('First Name'),
    familyNameField: getByLabelText('Family Name'),
    userNameField: getByLabelText('Username'),
    webIdField: getByLabelText('Web ID'),
    submitButton: getByLabelText('User Creation Submit')
  };
};

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe('When page loads', () => {
  it('renders correctly', () => {
    const { container } = render(<ManageUsers />);
    expect(container).toMatchSnapshot();
  });
});

describe('When user inputs information', () => {
  it('automatically creates proper Web ID based on username', () => {
    const { container, webIdField, userNameField } = renderFormFields();
  });
  it('requires user to click on lock icon before editing webIdField', () => {
    const { container, webIdField } = renderFormFields();
  });
  it('allows user to override system-generated web ID', () => {
    const { container, webIdField } = renderFormFields();
  });
});

describe('When user submits form', () => {
  it('Sends a properly-initialized user object to the network', () => {
    const { firstNameField, familyNameField, userNameField, webIdField, submitButton } =
      renderFormFields();
  });
  it('rejects a user created with no Web ID', () => {
    const { firstNameField, familyNameField, userNameField, submitButton } = renderFormFields();
  });
  it('rejects a user created with no username', () => {
    const { firstNameField, familyNameField, submitButton } = renderFormFields();
  });
  it('allows a user created with no first name', () => {
    const { firstNameField, familyNameField, userNameField, submitButton } = renderFormFields();
  });
  it('allows a user created with no last name', () => {
    const { firstNameField, familyNameField, userNameField, submitButton } = renderFormFields();
  });
});

describe('After a new user is added to the pod', () => {
  it('Updates the user list', () => {
    const { firstNameField, familyNameField, userNameField, submitButton } = renderFormFields();
  });
});
