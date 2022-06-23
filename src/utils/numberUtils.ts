const SI_PREFIXES_CENTER_INDEX = 8;

const siPrefixes: readonly string[] = [
  'y', 'z', 'a', 'f', 'p', 'n', 'μ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'
];

export const getSiPrefixedNumber = (number: number): string => {
  if (number === 0) return number.toString();
  const EXP_STEP_SIZE = 3;
  const base = Math.floor(Math.log10(Math.abs(number)));
  const siBase = (base < 0 ? Math.ceil : Math.floor)(base / EXP_STEP_SIZE);
  const prefix = siPrefixes[siBase + SI_PREFIXES_CENTER_INDEX];
  if (siBase === 0) return number.toString();
  const baseNumber = parseFloat((number / Math.pow(10, siBase * EXP_STEP_SIZE)).toFixed(2));
  return `${baseNumber}${prefix}`;
};