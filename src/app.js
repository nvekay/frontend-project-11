import onChange from 'on-change';
import validate from './utils/validate.js';
import renderDangerInput from './view.js';

export default () => {
  const elements = {
    form: document.querySelector('#add-url'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      valid: true,
      processState: 'filling',
      url: '',
      feeds: [],
      errors: [],
    },
  };

  const watchedState = onChange(state, (path, value, error) => {
    if (path === 'form.errors') {
      renderDangerInput(elements, value);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.url = elements.input.value;
    const validateErrors = validate({ url: watchedState.form.url });
    watchedState.form.errors = validateErrors;
    console.log(watchedState);
  });
};
