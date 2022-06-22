import {hasNotch} from 'react-native-device-info';
import moment from 'moment';
import 'moment/min/locales';
moment.locale('ko');

export const kmoment = moment;

export const HAS_NOTCH = hasNotch();

export const JWT = 'jwt';
export const BETTER_WORLD_MAIN_PUSH_CHANNEL = 'better-world-main-push-channel';