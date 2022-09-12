import axios from 'axios';
import i18next from 'i18next';
import watchedState from './view.js';
import ru from './locales/ru.js';
import validate from './utils/validate.js';
// import domParser from './utils/domParser.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then((i18n) => {
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
        networkError: {},
      },
    };

    const makeWatchedState = watchedState(state, elements, i18n);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      makeWatchedState.form.url = elements.input.value;
      validate({ url: makeWatchedState.form.url }, makeWatchedState, i18n)
        .then(() => {
          makeWatchedState.form.feeds.push(makeWatchedState.form.url);
          axios
            .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(makeWatchedState.form.url)}`)
            .then((response) => {
              console.log(response)
              if (response.data.status.content_type !== 'application/rss+xml; charset=utf-8') {
                makeWatchedState.form.errors = i18n('invalid_rss');
              } else {
                // domParser
              }
            })
            .catch((err) => {
              console.log(err);
              makeWatchedState.form.errors = i18n('network_error')
            });
        })
        .catch((err) => {
          makeWatchedState.form.errors = err;
        });
    });
  })
    .catch((err) => console.error(err));
};
