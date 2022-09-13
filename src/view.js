import onChange from 'on-change';

const renderDangerInput = (elements, error) => {
  elements.input.classList.add('is-invalid');
  elements.feedback.textContent = error;
};

const renderFeeds = (state, elements, i18n) => {
  const cardBody = document.createElement('div');
  const titleForFeeds = document.createElement('h2');
  const listForFeeds = document.createElement('ul');
  const divForTitle = document.createElement('div');

  cardBody.classList.add('card', 'border-0');
  divForTitle.classList.add('card-body');
  titleForFeeds.classList.add('card-title', 'h4');
  listForFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  titleForFeeds.textContent = i18n('title_feeds');

  state.form.feeds.forEach((item) => {
    const liElement = document.createElement('li');
    const titleForLiElement = document.createElement('h3');
    const textContainer = document.createElement('p');

    liElement.classList.add('list-group-item', 'border-0', 'border-end-0');
    titleForLiElement.classList.add('h6', 'm-0');
    textContainer.classList.add('m-0', 'small', 'text-black-50');

    textContainer.textContent = item.description;
    titleForLiElement.textContent = item.title;

    liElement.append(titleForLiElement, textContainer);
    listForFeeds.append(liElement);
  });

  divForTitle.append(titleForFeeds);
  cardBody.append(divForTitle, listForFeeds);
  elements.containerForFeeds.append(cardBody);
};

const renderPosts = (state, elements, i18n) => {
  const containerForPosts = document.createElement('div');
  const containerForTitle = document.createElement('div');
  const titleForPosts = document.createElement('h2');
  const listForPosts = document.createElement('ul');

  containerForPosts.classList.add('card', 'border-0');
  containerForTitle.classList.add('card-body');
  titleForPosts.classList.add('card-title', 'h4');
  listForPosts.classList.add('list-group', 'border-0', 'rounded-0');
  titleForPosts.textContent = i18n('title_posts');

  state.form.posts.flat(1).forEach(() => {
    const liElement = document.createElement('li');
    const linkForLi = document.createElement('a');

    liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    linkForLi.classList.add('fw-bold');
  });

  containerForTitle.append(titleForPosts);
  containerForPosts.append(containerForTitle);
  elements.containerForPosts.append(containerForPosts);
};

export default (state, elements, i18n) => onChange(state, (path, error) => {
  console.log(state.form.posts);
  console.log(path);
  switch (path) {
    case 'form.errors':
      renderDangerInput(elements, error);
      break;
    case 'form.feeds':
      renderFeeds(state, elements, i18n);
      renderPosts(state, elements, i18n);
      break;
    default:
      break;
  }
});
