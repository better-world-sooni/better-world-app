import {NativeModules, Platform} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {getVars} from './variables';

export const LOCALE_EN = 'en' as const;
export const LOCALE_KO = 'ko' as const;
export const SUPPORTED_LOCALES = [LOCALE_KO, LOCALE_EN];
export const LANGUAGE_NAMES = {
  en: 'English',
  ko: '한국어',
};

export type LocaleType = typeof SUPPORTED_LOCALES[number];

const localeIndex = locale => {
  switch (locale) {
    case LOCALE_EN:
      return 1;
    case LOCALE_KO:
    default:
      return 0;
  }
};

type TextType = string | Element | Array<any>;

const getDeviceLanguage = () => {
  return Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    : NativeModules.I18nManager.localeIdentifier;
};

export const getLocaleFromDevice = () => {
  const lang = getDeviceLanguage();
  return lang === 'en' || lang === 'en_US' ? LOCALE_EN : LOCALE_KO;
};

export const useLocale = () => {
  const {userLocale, tempLocale} = useSelector(
    (root: RootState) => ({
      userLocale: root.app.session.user?.locale,
      tempLocale: root.app.tempLocale,
    }),
    shallowEqual,
  );
  let locale = 'ko';
  if (userLocale) {
    locale = userLocale === LOCALE_EN ? LOCALE_EN : LOCALE_KO;
  } else {
    locale = tempLocale;
  }
  const isEN = locale === LOCALE_EN;
  const isKO = locale === LOCALE_KO;
  const t = (obj: TextType): any => {
    if (typeof obj === 'string') {
      return obj;
    }
    const value = obj[localeIndex(locale)];
    return value ? value : '';
  };
  const vars = getVars(t);
  return {t, locale, isKO, isEN, vars, tempLocale};
};
