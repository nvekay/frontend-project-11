import onChange from 'on-change';

const renderDangerInput = (elements, error) => {
  elements.input.classList.add('is-invalid');
  elements.feedback.textContent = error;
};

export default (state, elements) => onChange(state, (path, error) => {
  switch (path) {
    case 'form.errors':
      renderDangerInput(elements, error);
      break;
    default:
      break;
  }
});
