import moment from 'moment';
import 'moment/min/locales';
moment.locale('ko');

export const kmoment = moment;

export function createdAtText(createdAt) {
  if (createdAt) {
    const calendar = kmoment(createdAt).calendar();
    const calendarArr = calendar.split(' ');
    if (calendarArr[0] == '오늘') {
      return calendarArr[1] + ' ' + calendarArr[2];
    }
    if (calendarArr[0] == '어제') {
      return calendarArr[0];
    }
    if (calendarArr[0] == '지난주') {
      return calendarArr[1];
    }
    return calendarArr[0];
  }
  return null;
}

export function getCalendarDay(time) {
  if (!time) return null;
  return kmoment(time).calendar();
}

export function getDate(time, format = 'YYYY.MM.DD HH:mm:ss') {
  if (!time) return null;
  return kmoment(time).format(format);
}

export function getNowDifference(stringDate) {
  if (!stringDate) return null;
  const date = new Date(stringDate);
  const date1utc = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
  const nowDate = new Date();
  const date2utc = Date.UTC(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
    nowDate.getHours(),
    nowDate.getMinutes(),
    nowDate.getSeconds(),
  );
  const day = 1000 * 60 * 60 * 24;
  return (date1utc - date2utc) / day >= 0
    ? Math.floor((date1utc - date2utc) / day)
    : -1;
}
