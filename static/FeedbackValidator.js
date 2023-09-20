export function FeedbackValidator(value) {
  const re = /^[A-Za-z\s!@#$%^&*()_+{}[\]:;<>,.?~\\/-]*$/;
  if (!value) return "Feedback cannot be empty.";
  if (!re.test(value))
    return "Please enter valid feedback (alphabets, spaces, and symbols are allowed).";
  return "";
}
