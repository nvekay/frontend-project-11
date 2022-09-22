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
      modal: document.querySelector('#modal'),
      feedback: document.querySelector('.feedback'),
      containerForFeeds: document.querySelector('.feeds'),
      containerForPosts: document.querySelector('.posts'),
      cardBorder: document.querySelector('.card'),
    };

    const state = {
      form: {
        processState: 'filling',
        url: '',
        urlContainer: [],
        posts: [],
        feeds: [],
        errors: {},
        modal: {
          id: null,
        },
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
      validate({ url: elements.input.value }, watchedState, i18n)
        .then(() => {
          watchedState.form.url = elements.input.value;
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
                  watchedState.form.processState = 'finished';
                } catch (error) {
                  watchedState.form.errors = i18n('parsing_error');
                }
              }
            })
            .catch((err) => {
              watchedState.form.errors = i18n(err.code);
            });
        })
        .catch((err) => {
          watchedState.form.errors = err;
        });
      updatePosts(watchedState);
    });

    elements.containerForPosts.addEventListener('click', (e) => {
      watchedState.form.modal.id = e.target.dataset.id;
      const post = watchedState.form.posts.find((item) => item.id === e.target.dataset.id);
      post.state = 'read';
    });
  })
    .catch((err) => console.error(err));
};
