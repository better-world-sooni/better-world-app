import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';

export const fileChecksum = async file => {
  const hex = await RNFS.hash(decodeURI(file.uri), 'md5');
  const checksum = Buffer.from(hex, 'hex').toString('base64');
  return checksum;
};

export const fileBase64 = async path => {
  if (path == null || path == '') return '';
  const base64 = await RNFS.readFile(path, 'base64').then(res => {
    return res;
  });
  return base64;
};
