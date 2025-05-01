const numberCurrency = (value?: number) => value?.toLocaleString(undefined, {
  style: 'currency',
  currency: 'EUR'
}) || '-';

export default numberCurrency;