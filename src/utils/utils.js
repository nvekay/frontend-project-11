import { uniqueId } from 'lodash';
import axios from 'axios';

export default (data) => {
  const normalaizeData = data.map((content) => {
    const id = uniqueId();
    const newId = {
      id,
    };
    return { ...content, ...newId };
  });
  return normalaizeData;
};

const proxy = 'https://allorigins.hexlet.app/get';

export const getDataFromProxy = (url) => axios.get(proxy, {
  params: {
    disableCache: true,
    url,
  },
});
