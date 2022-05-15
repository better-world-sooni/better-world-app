/* eslint-disable no-bitwise */
import querystring from 'query-string';

export const urlWithQuery = (url, query) => {
  return query ? `${url}?${querystring.stringify(query)}` : url;
};
