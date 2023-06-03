import { useState } from 'react';

/**
 * @typedef {import('../typedefs').useFieldObject} useFieldObject
 */

/**
 * Custom hook that provide the value of input element, type attribute of HTML
 * input element, set value of input element onChange, and a clear value
 * function
 *
 * @memberof hooks
 * @function useField
 * @param {string} type - Type attribute of HTML input element
 * @returns {useFieldObject} useFieldObject - An object that contains { type,
 * value, onChange, clearValue } (see {@link useFieldObject})
 */

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const clearValue = () => {
    setValue('');
  };

  return {
    type,
    value,
    onChange,
    clearValue
  };
};

export default useField;
