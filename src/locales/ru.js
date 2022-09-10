import { setLocale } from 'yup';

setLocale({
  mixed: {
    notOneOf: { key: 'repeatUrl' },
  },
  string: {
    url: { key: 'validUrl' },
  },
});

export default {
  translation: {
    validUrl: 'Ссылка должна быть валидным URL',
    repeatUrl: 'RSS уже существует',
  },
};
