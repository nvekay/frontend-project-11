import { uniqueId } from 'lodash';

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
