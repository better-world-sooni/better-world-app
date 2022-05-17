import {hasNotch} from 'react-native-device-info';
import moment from 'moment';
import 'moment/min/locales';
moment.locale('ko');

export const kmoment = moment;

export const HAS_NOTCH = hasNotch();
export const LINE2_COLOR = 'rgb(255, 219, 120)';

export const JWT = 'jwt';

export const shadowProp = {
  shadowOffset: {height: 1, width: 1},
  shadowColor: 'gray',
  shadowOpacity: 0.5,
  shadowRadius: 3,
};

export const WS_URL = 'https://ws.metasgid.com';
// export const WS_URL = 'http://localhost:8000';

export function truncateKlaytnAddress(fullStr, strLen = 12, separator = '...') {
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

export enum KlaytnAccount {
  KASAccount = 'KASAccount',
  KaikasAccount = 'KaikasAccount',
  KlipAccount = 'KlipAccount',
}
