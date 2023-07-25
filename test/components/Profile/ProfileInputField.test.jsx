import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProfileInputField } from '../../../src/components/Profile';
import '@testing-library/jest-dom/extend-expect';

const MockProfileComponent = ({ name }) => {
  const mockInputName = 'Name';
  const mockInputValue = name;
  const [, mockSetInputValue] = useState('');
  const [mockEdit] = useState(false);
  return (
    <ProfileInputField
      inputName={mockInputName}
      inputValue={mockInputValue}
      setInputValue={mockSetInputValue}
      edit={mockEdit}
    />
  );
};

describe('ProfileInputField', () => {
  it('renders ProfileInputField with name Alice', () => {
    const mockInputValue = 'Alice';
    const { queryByRole } = render(<MockProfileComponent name={mockInputValue} />);
    const inputElement = queryByRole('textbox');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('value', mockInputValue);
    expect(inputElement).toHaveAttribute('placeholder', mockInputValue);
    expect(inputElement).toHaveAttribute('disabled');
  });

  it('renders ProfileInputField with name Alice', () => {
    const mockInputValue = null;
    const { queryByRole } = render(<MockProfileComponent name={mockInputValue} />);
    const inputElement = queryByRole('textbox');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('value', '');
    expect(inputElement).toHaveAttribute('placeholder', 'No value set');
    expect(inputElement).toHaveAttribute('disabled');
  });
});
