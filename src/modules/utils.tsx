/* eslint-disable no-bitwise */
import querystring from 'query-string';
import {Direction, LINE2_Linked_List} from './constants';

export const urlWithQuery = (url, query) => {
  return query ? `${url}?${querystring.stringify(query)}` : url;
};

export const getDday = date => {
  let now = new Date().getTime();
  let remainTime = date - now;
  let days = Math.floor(remainTime / (1000 * 60 * 60 * 24));
  return days;
};

export const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const shortenAddress = function (address) {
  return address.replace('대한민국 서울특별시', '');
};

export const stationArr = (arr, start, end, direction, limit = null) => {
  if (start && end) {
    const curr = LINE2_Linked_List[start];
    if (limit) {
      if (direction === Direction.CW) {
        if (curr.next === end || arr.length - 1 === limit) {
          arr.push(start, end);
          return arr;
        } else {
          arr.push(start);
          return stationArr(arr, curr.next, end, direction);
        }
      } else {
        if (curr.prev === end || arr.length - 1 === limit) {
          arr.push(start, end);
          return arr;
        } else {
          arr.push(start);
          return stationArr(arr, curr.prev, end, direction);
        }
      }
    } else {
      if (direction === Direction.CW) {
        if (curr.next === end) {
          arr.push(start, end);
          return arr;
        } else {
          arr.push(start);
          return stationArr(arr, curr.next, end, direction);
        }
      } else {
        if (curr.prev === end) {
          arr.push(start, end);
          return arr;
        } else {
          arr.push(start);
          return stationArr(arr, curr.prev, end, direction);
        }
      }
    }
  } else {
    return [];
  }
};