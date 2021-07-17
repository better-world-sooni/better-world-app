import {Platform} from 'react-native';
import urljoin from 'url-join';

export const BASE_URL = 'https://www.ringleplus.com';
export const APP_URL = 'https://app.ringleplus.com';
const base = (path) => urljoin(BASE_URL, path);
const app = (path) => urljoin(APP_URL, path);

export const WEBVIEW_URL = {
  faqUrl: (userId, locale) =>
    base(`/${locale}/student/portal/help/faq?user_id=${userId}&app=true`),
  purchaseUrl: (userId, locale) =>
    base(`/${locale}/student/portal/pricing?user_id=${userId}&app=true`),
  eventUrl: (userId, locale) =>
    base(
      `/${locale}/student/portal/event/challenge?user_id=${userId}&app=true`,
    ),
  memoUrl: (userId) => app(`/portal/challenge?user_id=${userId}&app=true`),
  invite: (userId) => app(`/student/invite?user_id=${userId}&app=true`),
  noticeView: (userId, id) =>
    app(
      `/portal/notice?user_id=${userId}&notice_id=${id}&app=true&mobile_device=${Platform.OS}`,
    ),
  noticeListUrl: (userId, locale) =>
    base(`/${locale}/student/portal/notice/notice-list?user_id=${userId}`),
  pointManageUrl: (userId, type) =>
    app(
      `/portal/point_manage?user_id=${userId}&type=${type}&app=true&mobile_device=${Platform.OS}`,
    ),
  trialUrl: (userId, locale) =>
    base(`/${locale}/student/portal/trial?user_id=${userId}&app=true`),
  creditManageUrl: (userId) =>
    app(
      `/portal/credit?user_id=${userId}&app=true&mobile_device=${Platform.OS}`,
    ),
  evaluationUrl: (userId, locale, id) =>
    base(
      `/${locale}/student/portal/lessons/review/evaluation/${id}?user_id=${userId}`,
    ),
};
