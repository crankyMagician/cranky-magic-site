/**
* Formats a number as currency
* @param {number} amount - The amount to format
* @param {string} currencyCode - The currency code (default: 'USD')
* @param {string} locale - The locale for formatting (default: 'en-US')
* @returns {string} The formatted currency string
  */
  export const formatCurrency = (amount, currencyCode = 'USD', locale = 'en-US') => {
  try {
  return new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: currencyCode
  }).format(amount);
  } catch (error) {
  console.error('Currency formatting error:', error);
  return `${currencyCode} ${amount}`;
  }
  };