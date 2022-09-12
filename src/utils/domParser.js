export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  return doc;
};
