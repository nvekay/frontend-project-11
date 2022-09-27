import onChange from 'on-change';

const renderFillingProcess = (elements) => {
  elements.button.disabled = false;
  elements.input.removeAttribute('readonly', '');
  elements.feedback.innerHTML = '';
  elements.feedback.classList.remove('text-success');
  elements.input.classList.remove('is-invalid');
  elements.feedback.classList.remove('text-danger');
};

const renderLoadingProcess = (elements, i18n) => {
  elements.button.disabled = true;
  elements.input.setAttribute('readonly', '');
  elements.feedback.classList.remove('text-success');
  elements.input.classList.remove('is-invalid');
  elements.feedback.classList.remove('text-danger');
  elements.feedback.textContent = i18n('loading_process');
};

const renderDangerInput = (elements, error) => {
  elements.feedback.innerHTML = '';
  elements.feedback.classList.add('text-danger');
  elements.input.classList.add('is-invalid');
  elements.feedback.textContent = error;
};

const renderError = (elements) => {
  elements.button.disabled = false;
  elements.input.removeAttribute('readonly', '');
};

const renderSuccessInput = (elements, i18n) => {
  elements.button.disabled = false;
  elements.input.removeAttribute('readonly', '');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = i18n('rss_success');
  elements.input.value = '';
  elements.input.focus();
};

const handleProcessState = (elements, processState, i18n) => {
  switch (processState) {
    case 'filling':
      renderFillingProcess(elements);
      break;
    case 'loading':
      renderLoadingProcess(elements, i18n);
      break;
    case 'finished':
      renderSuccessInput(elements, i18n);
      break;
    case 'error':
      renderError(elements);
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const renderFeeds = (state, elements, i18n) => {
  elements.containerForFeeds.innerHTML = '';

  const cardBody = document.createElement('div');
  const titleForFeeds = document.createElement('h2');
  const divForTitle = document.createElement('div');
  const listForFeeds = document.createElement('ul');

  cardBody.classList.add('card', 'border-0');
  divForTitle.classList.add('card-body');
  titleForFeeds.classList.add('card-title', 'h4');
  titleForFeeds.textContent = i18n('title_feeds');
  listForFeeds.classList.add('list-group', 'border-0', 'rounded-0');

  state.data.feeds.forEach((item) => {
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
  elements.containerForPosts.innerHTML = '';

  const containerForPosts = document.createElement('div');
  const containerForTitle = document.createElement('div');
  const titleForPosts = document.createElement('h2');
  const ul = document.createElement('ul');

  containerForPosts.classList.add('card', 'border-0');
  containerForTitle.classList.add('card-body');
  titleForPosts.classList.add('card-title', 'h4');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  titleForPosts.textContent = i18n('title_posts');

  state.data.posts.forEach((item) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const btn = document.createElement('button');

    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const fontClass = state.viewedPotsIds.has(item.id) ? 'fw-normal' : 'fw-bold';
    link.classList.add(fontClass);
    link.setAttribute('href', item.link);
    link.textContent = item.title;
    link.setAttribute('data-id', item.id);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-id', item.id);
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.textContent = i18n('button_text');

    li.append(link, btn);
    ul.append(li);
  });

  containerForTitle.append(titleForPosts);
  containerForPosts.append(containerForTitle, ul);
  elements.containerForPosts.append(containerForPosts);
};

const renderModal = (state, elements, id) => {
  const link = document.querySelector(`[data-id="${id}"]`);
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');

  const [findPost] = state.data.posts.filter((post) => post.id === id);
  const modalDiv = elements.modal;

  const modalTitle = modalDiv.querySelector('.modal-title');
  modalTitle.textContent = findPost.title;

  const modalDescription = modalDiv.querySelector('.modal-body');
  modalDescription.textContent = findPost.description;

  const modalLink = modalDiv.querySelector('.full-article');
  modalLink.setAttribute('href', findPost.link);
};

export default (state, elements, i18n) => onChange(state, (path, value) => {
  switch (path) {
    case 'errors':
      renderDangerInput(elements, value);
      break;
    case 'data.feeds':
      renderFeeds(state, elements, i18n);
      break;
    case 'data.posts':
      renderPosts(state, elements, i18n);
      break;
    case 'modalId':
      renderModal(state, elements, value);
      break;
    case 'processState.state':
      handleProcessState(elements, value, i18n);
      break;
    default:
      break;
  }
});
