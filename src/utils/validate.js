import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'Ссылка не корретна',
  },
});

const schema = yup.object().shape({
  url: yup.string().url(),
});

export default (url) => schema.validate(url).catch((err) => err.errors);
