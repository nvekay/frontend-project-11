import * as yup from 'yup';

export default (url, state, t) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.form.feeds),
  });
  return schema.validate(url)
    .then(() => ({}))
    .catch((errors) => {
      const errKey = errors.errors.map((err) => t(err.key));
      throw errKey;
    });
};
