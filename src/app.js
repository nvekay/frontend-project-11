import i18next from 'i18next';
import watchedState from './view.js';
import ru from './locales/ru.js';
import validate from './utils/validate.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then((t) => {
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

    const makeWatchedState = watchedState(state, elements, t);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      makeWatchedState.form.url = elements.input.value;
      validate({ url: makeWatchedState.form.url }, makeWatchedState, t)
        .then(() => makeWatchedState.form.feeds.push(makeWatchedState.form.url))
        .catch((err) => {
          makeWatchedState.form.errors = err;
        });
      console.log(makeWatchedState);
    });
  })
    .catch((err) => console.error(err));
};
