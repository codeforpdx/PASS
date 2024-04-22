// React imports
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Testing imports
import { expect, it, describe, vi } from 'vitest';
import userEvent from '@testing-library/user-event';


// Component being tested
import { ExistingPodForm } from '@components/Signup';
import { login } from '@inrupt/solid-client-authn-browser';

vi.mock('@inrupt/solid-client-authn-browser');


describe('ExistingPodForm', () => {
    it('renders', () => {
      render(
        <Router>
          <ExistingPodForm />
        </Router>
      );
  
      const textField = screen.getByRole('textbox', { name: 'Pod Provider' });
  
      expect(textField).not.toBeNull();
    });

    it('calls the login function when the form is submitted', async() => {


        render(
          <Router>
            <ExistingPodForm />
          </Router>
        );
        
        let subButton = screen.getByRole('button', { name: "Login to Pod Provider" });
        expect(subButton).not.toBeNull();
    
        const user = userEvent.setup();
        await user.click(subButton);

        expect(login).toHaveBeenCalled();
      });
  });

 