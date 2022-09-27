import i18next from 'i18next';
import { differenceBy } from 'lodash';
import makeWatchedState from './view.js';
import ru from './locales/ru.js';
import validate from './utils/validate.js';
import domParser from './utils/domParser.js';
import { normalaizeData, getResponse } from './utils/utils.js';

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
      button: document.querySelector('#rss-btn'),
    };

    const state = {
      processState: {
        state: 'filling',
      },
      data: {
        posts: [],
        feeds: [],
      },
      errors: {},
      viewedPotsIds: new Set(),
      modalId: null,
    };

    const watchedState = makeWatchedState(state, elements, i18n);

    const updatePosts = (observerState) => {
      const links = watchedState.data.feeds.map((feed) => feed.link);
      const promises = links.map((link) => getResponse(link)
        .then((response) => {
          const [, posts] = domParser(response.data.contents);
          const newPosts = differenceBy(posts, observerState.data.posts, 'link');
          const normalizePosts = normalaizeData(newPosts);
          observerState.data.posts = [...normalizePosts, ...observerState.data.posts];
        }));
      Promise.all(promises).finally(() => setTimeout(updatePosts, 5000, watchedState));
    };

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.processState.state = 'loading';
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validate({ url }, watchedState)
        .then(({ url: validUrl }) => getResponse(validUrl))
        .then((response) => {
          watchedState.processState.state = 'finished';
          const dom = domParser(response.data.contents, url);
          const [feed, posts] = dom;
          const normalizeFeed = normalaizeData(feed);
          const normalizePosts = normalaizeData(posts);
          watchedState.data.feeds = [...normalizeFeed, ...watchedState.data.feeds];
          watchedState.data.posts = [...normalizePosts, ...watchedState.data.posts];
        })
        .catch((error) => {
          watchedState.processState.state = 'error';
          switch (error.name) {
            case 'ValidationError':
              watchedState.errors = error.errors.map((err) => i18n(err.key));
              break;
            case 'AxiosError':
              watchedState.errors = i18n('err_network');
              break;
            case 'Error':
              watchedState.errors = i18n('invalid_rss');
              break;
            default:
              throw new Error(`${error}`);
          }
        });
    });

    updatePosts(watchedState);

    elements.containerForPosts.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      watchedState.modalId = id;
      watchedState.viewedPotsIds.add(id);
    });
  })
    .catch((err) => console.error(err));
};
