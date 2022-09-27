export default (data, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('ParsingError');
  } else {
    const feedTitle = doc.querySelector('title').innerHTML;
    const feedDescription = doc.querySelector('description').innerHTML;
    const feed = {
      title: feedTitle,
      description: feedDescription,
      link: url,
    };
    const feedCollection = [feed];

    const items = [...doc.querySelectorAll('item')];
    const posts = items.map((item) => ({
      title: item.querySelector('title').innerHTML,
      description: item.querySelector('description').innerHTML,
      link: item.querySelector('link').innerHTML,
      state: 'unread',
    }));
    return [feedCollection, posts];
  }
};
