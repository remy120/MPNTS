export function NumericValidator(value) {
  const re = /^[0-9.]*$/;
  if (!value) return "Field cannot be empty.";
  if (!re.test(value)) return "Please enter numbers and periods (dots) only.";
  return "";
}
