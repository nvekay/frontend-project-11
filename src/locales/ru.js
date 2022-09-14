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
    invalid_rss: 'Ресурс не содержит валидный RSS',
    ERR_NETWORK: 'Ошибка сети',
    parsing_error: 'Ошибка парсинга',
    title_feeds: 'Фиды',
    title_posts: 'Посты',
    button_text: 'Просмотр',
  },
};
