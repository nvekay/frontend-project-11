import axios from 'axios';
import i18next from 'i18next';
import { differenceBy } from 'lodash';
import makeWatchedState from './view.js';
import ru from './locales/ru.js';
import validate from './utils/validate.js';
import domParser from './utils/domParser.js';
import normalaizeData from './utils/utils.js';

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
      containerForFeeds: document.querySelector('.feeds'),
      containerForPosts: document.querySelector('.posts'),
    };

    const state = {
      form: {
        processState: 'filling',
        url: '',
        urlContainer: [],
        posts: [],
        feeds: [],
        errors: {},
      },
    };

    const watchedState = makeWatchedState(state, elements, i18n);

    const updatePosts = (observerState) => {
      const promises = observerState.form.urlContainer.map((link) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
        .then((response) => {
          const [, posts] = domParser(response.data.contents);
          const newPosts = differenceBy(posts, observerState.form.posts, 'link');
          const normalizePosts = normalaizeData(newPosts);
          observerState.form.posts = [...normalizePosts, ...observerState.form.posts];
        }));
      Promise.all(promises).finally(() => setTimeout(updatePosts, 5000, watchedState));
    };

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.form.url = elements.input.value;
      validate({ url: watchedState.form.url }, watchedState, i18n)
        .then(() => {
          axios
            .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(watchedState.form.url)}`)
            .then((response) => {
              if (response.data.status.content_type !== 'application/rss+xml; charset=utf-8') {
                watchedState.form.errors = i18n('invalid_rss');
              } else {
                try {
                  const dom = domParser(response.data.contents);
                  const [feed, posts] = dom;
                  const normalizeFeed = normalaizeData(feed);
                  const normalizePosts = normalaizeData(posts);
                  watchedState.form.feeds = [...normalizeFeed, ...watchedState.form.feeds];
                  watchedState.form.posts = [...normalizePosts, ...watchedState.form.posts];
                  watchedState.form.urlContainer.push(watchedState.form.url);
                } catch (error) {
                  makeWatchedState.form.errors = i18n('parsing_error');
                }
              }
            })
            .catch((err) => {
              makeWatchedState.form.errors = i18n(err.code);
            });
        })
        .catch((err) => {
          makeWatchedState.form.errors = err;
        });
      console.log(updatePosts(watchedState));
    });
  })
    .catch((err) => console.error(err));
};
