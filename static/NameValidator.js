export function NameValidator(value) {
  const re = /^[A-Za-z\s]*$/;
  if (!value) return "Name cannot be empty.";
  if (!re.test(value))
    return "Please enter a valid name (alphabets and spaces only).";
  return "";
}
