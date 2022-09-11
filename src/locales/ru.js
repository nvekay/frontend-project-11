import { setLocale } from 'yup';

setLocale({
  mixed: {
    notOneOf: { key: 'repeat_url' },
  },
  string: {
    url: { key: 'invalid_url' },
  },
});

export default {
  translation: {
    invalid_url: 'Ссылка должна быть валидным URL',
    repeat_url: 'RSS уже существует',
  },
};
