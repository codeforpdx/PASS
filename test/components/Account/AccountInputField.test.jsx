import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccountInputField } from '../../../src/components/Account';
import '@testing-library/jest-dom/extend-expect';

const MockAccountComponent = ({ name }) => {
  const mockInputName = 'Name';
  const mockInputValue = name;
  const [, mockSetInputValue] = useState('');
  const [mockEdit] = useState(false);
  return (
    <AccountInputField
      inputName={mockInputName}
      inputValue={mockInputValue}
      setInputValue={mockSetInputValue}
      edit={mockEdit}
    />
  );
};

describe('AccountInputField', () => {
  it('renders AccountInputField with name Alice', () => {
    const mockInputValue = 'Alice';
    const { queryByRole } = render(<MockAccountComponent name={mockInputValue} />);
    const inputElement = queryByRole('textbox');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('value', mockInputValue);
    expect(inputElement).toHaveAttribute('placeholder', mockInputValue);
    expect(inputElement).toHaveAttribute('disabled');
  });

  it('renders AccountInputField with empty string and placeholder for "No value set" if inputValue is null', () => {
    const mockInputValue = null;
    const { queryByRole } = render(<MockAccountComponent name={mockInputValue} />);
    const inputElement = queryByRole('textbox');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('value', '');
    expect(inputElement).toHaveAttribute('placeholder', 'No value set');
    expect(inputElement).toHaveAttribute('disabled');
  });
});
