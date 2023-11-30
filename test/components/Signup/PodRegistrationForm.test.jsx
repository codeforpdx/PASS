// React imports
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Testing imports
import { expect, it, describe } from 'vitest';

// Component being tested
import { PodRegistrationForm } from '@components/Signup';

describe('PodRegistrationForm', () => {
  it('renders', () => {
    render(
      <Router>
        <PodRegistrationForm />
      </Router>
    );

    const textField = screen.getByRole('textbox', { name: 'Email' });
    const inputElementPassword = screen.getByLabelText('Password');
    const inputElementConfirmPassord = screen.getByLabelText('Confirm Password');

    expect(textField).not.toBeNull();
    expect(inputElementPassword).not.toBeNull();
    expect(inputElementConfirmPassord).not.toBeNull();
  });
});
