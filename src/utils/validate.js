import * as yup from 'yup';

export default (url, state) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.data.feeds.map((feed) => feed.link)),
  });
  return schema.validate(url);
};
