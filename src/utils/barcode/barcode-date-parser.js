const formattedDate = (dateStr) => {
  const dateStrWithSpaces = dateStr.replace(/(\d{2})(\d{2})(\d{4})/, '$1 $2 $3');
  const newDate = new Date(dateStrWithSpaces);
  return newDate.toISOString().substring(0, 10);
};

export default formattedDate;
