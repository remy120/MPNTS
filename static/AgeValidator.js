export function AgeValidator(value) {
  const re = /^[0-9]*$/;
  if (!value) return "Age cannot be empty.";
  if (!re.test(value)) return "Please enter a legit age (numbers only).";
  return "";
}
