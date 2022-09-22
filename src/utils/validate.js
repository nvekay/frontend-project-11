import * as yup from 'yup';

export default (url, state) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.form.urlContainer),
  });
  return schema.validate(url);
};
