// React imports
import React from 'react';
import { render, screen, act  } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Testing imports
import { expect, it, describe } from 'vitest';

// Component being tested
import PodRegistrationForm from '../../../src/components/Signup/PodRegistrationForm';

describe('PodRegistrationForm', () => {
  it('Renders the PodRegistrationForm Component', () => {
    act(() => {
      render (
        <Router>
          <PodRegistrationForm />
        </Router>
      );
      });

    const textField = screen.getByLabelText('Email');
    const inputElementPassword = screen.getByLabelText('Password');
    const inputElementConfirmPassord = screen.getByLabelText('Confirm Password');

    expect(textField).to.equal('Email');
    expect(inputElementPassword).to.equal('Password');
    expect(inputElementConfirmPassord).to.equal('Confirm Password');
  });
});
