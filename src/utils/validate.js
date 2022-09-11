import * as yup from 'yup';

export default (url, state, i18n) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.form.feeds),
  });
  return schema.validate(url)
    .then(() => ({}))
    .catch((errors) => {
      const errorMessage = errors.errors.map((err) => i18n(err.key));
      throw errorMessage;
    });
};
