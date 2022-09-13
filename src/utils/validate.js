import * as yup from 'yup';

export default (url, state, i18n) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.form.urlContainer),
  });
  return schema.validate(url)
    .then(() => ({}))
    .catch((err) => {
      const errorMessage = err.errors.map((errors) => i18n(errors.key));
      throw errorMessage;
    });
};
