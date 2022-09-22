import axios from 'axios';
import i18next from 'i18next';
import { differenceBy } from 'lodash';
import makeWatchedState from './view.js';
import ru from './locales/ru.js';
import validate from './utils/validate.js';
import domParser from './utils/domParser.js';
import normalaizeData, { getDataFromProxy } from './utils/utils.js';

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
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validate({ url }, watchedState, i18n)
        .then(({ url: validUrl }) => getDataFromProxy(validUrl))
        .then((response) => {
          const dom = domParser(response.data.contents);
          const [feed, posts] = dom;
          const normalizeFeed = normalaizeData(feed);
          const normalizePosts = normalaizeData(posts);
          watchedState.form.feeds = [...normalizeFeed, ...watchedState.form.feeds];
          watchedState.form.posts = [...normalizePosts, ...watchedState.form.posts];
          watchedState.form.urlContainer.push(url);
          watchedState.form.processState = 'finished';
          elements.input.value = '';
          elements.input.focus();
        })
        .catch((error) => {
          console.log(error);
          switch (error.name) {
            case 'ValidationError':
              watchedState.form.errors = error.errors.map((err) => i18n(err.key));
              break;
            case 'AxiosError':
              watchedState.form.errors = i18n('err_network');
              break;
            case 'ParsingError':
              watchedState.form.errors = i18n('invalid_rss');
              break;
            default:
              throw new Error(`${error}`);
          }
        });
    });

    updatePosts(watchedState);

    elements.containerForPosts.addEventListener('click', (e) => {
      watchedState.form.modal.id = e.target.dataset.id;
      const post = watchedState.form.posts.find((item) => item.id === e.target.dataset.id);
      post.state = 'read';
    });
  })
    .catch((err) => console.error(err));
};
