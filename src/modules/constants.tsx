import {hasNotch} from 'react-native-device-info';
import moment from 'moment';
import 'moment/min/locales';
moment.locale('ko');

export const kmoment = moment;

export const HAS_NOTCH = hasNotch();

export const JWT = 'jwt';
export const BETTER_WORLD_MAIN_PUSH_CHANNEL = 'better-world-main-push-channel';

export function truncateKlaytnAddress(fullStr, strLen = 12, separator = '...') {
  if (!fullStr) return;
  if (fullStr.length <= strLen) return fullStr;

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
}