import { useState, useEffect } from 'react';

const useSortedData = (getFieldValue, initialFieldType, initialData = []) => {
  const [fieldType, setFieldType] = useState(initialFieldType);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const sortData = (field, dataToSort = []) => {
      if (!Array.isArray(dataToSort)) return [];
      return [...dataToSort].sort((a, b) => {
        const fieldA = getFieldValue(a, field) || '';
        const fieldB = getFieldValue(b, field) || '';
        return fieldA.localeCompare(fieldB);
      });
    };

    setSortedData(sortData(initialData, fieldType));
  }, [fieldType, initialData, getFieldValue]);

  return { fieldType, setFieldType, sortedData };
};

export default useSortedData;
