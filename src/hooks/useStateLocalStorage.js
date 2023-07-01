import { useState } from 'react';

const useStateLocalStorage = (localStorageKey) => {
  const storedValue = localStorage.getItem(localStorageKey);
  const [value, setValue] = useState(storedValue || null);

  const setValueLocalStorage = (newValue) => {
    localStorage.setItem(localStorageKey, newValue);
    setValue(newValue);
  };

  return [value, setValueLocalStorage];
};

export default useStateLocalStorage;
