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
      errors: {},
    },
  };

  const watchedState = onChange(state, (path, error) => {
    console.log(error);
    if (path === 'form.errors') {
      renderDangerInput(elements, error);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.url = elements.input.value;
    validate({ url: watchedState.form.url })
      .catch((err) => {
        watchedState.form.errors = err;
      });
    console.log(watchedState);
  });
};
