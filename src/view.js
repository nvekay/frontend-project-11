export default (elements, error) => {
  elements.feedback.innerHTML = '';
  elements.input.classList.add('is-invalid');
  elements.feedback.textContent = `${error}`;
};
