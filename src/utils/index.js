import { ISBN10_REGEX, ISBN13_REGEX } from "../constants";

const validateISBN10 = (value) => {
  if (!value.match(ISBN10_REGEX)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let num = Number.parseInt(value[i]);
    sum += num * (10 - i);
  }

  const lastCharacter = value[9];
  const checksum = lastCharacter === "X" ? 10 : Number.parseInt(lastCharacter);

  sum += checksum;

  return sum % 11 === 0;
};

const validateISBN13 = (value) => {
  if (!value.match(ISBN13_REGEX)) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const num = Number.parseInt(value[i]);
    sum += i % 2 === 0 ? num : num * 3;
  }

  const checksum = (10 - (sum % 10)) % 10;
  const lastDigit = Number.parseInt(value[12]);

  return checksum === lastDigit;
};

export const validateISBN = (value) => {
  value = value.replace(/[\s-]+/g, "");

  if (value.length === 10) return validateISBN10(value);

  if (value.length === 13) return validateISBN13(value);

  return false;
};
