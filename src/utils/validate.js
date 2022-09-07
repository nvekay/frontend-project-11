import * as yup from 'yup';
import keyBy from 'lodash';

yup.setLocale({
  string: {
    url: 'Ссылка не корретна',
  },
});

const schema = yup.object().shape({
  url: yup.string().url(),
});

export default (url) => schema.validate(url)
  .then(() => ({}))
  .catch((err) => {
    console.log(err);
    console.log(err.inner)
    throw keyBy(err.inner, err.name);
  });
