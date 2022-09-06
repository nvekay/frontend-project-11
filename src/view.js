export default (elements, error) => {
  elements.input.classList.add('is-invalid');
  elements.feedback.textContent = `${error}`;
};
