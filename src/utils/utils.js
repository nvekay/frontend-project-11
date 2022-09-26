import { uniqueId } from 'lodash';
import axios from 'axios';

export const normalaizeData = (data) => {
  const normalaize = data.map((content) => {
    const id = uniqueId();
    const newId = {
      id,
    };
    return { ...content, ...newId };
  });
  return normalaize;
};

export const getResponse = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`);
