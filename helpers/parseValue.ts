const parseValue = (value: string): number => {
  return parseFloat(value.replace(',', '.'));
}

export default parseValue;