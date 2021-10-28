import {hasNotch} from 'react-native-device-info';
export const IOS_APP_VERSION = '6.0.5';
export const ANDROID_APP_VERSION = '6.0.5';
export const IOS_CODE_PUSH_VERSION = '117';
export const ANDROID_CODE_PUSH_VERSION = '45';
export const JWT_TOKEN = 'jwt_token';
export const HAS_NOTCH = hasNotch();
export const GO_COLOR = 'rgb(10, 96, 254)';
export const LINE2_Linked_List = {
  시청: {
    prev: '충정로(경기대입구)',
    next: '을지로입구(IBK기업은행)',
    transfer: ['1호선'],
  },
  '을지로입구(IBK기업은행)': {
    prev: '시청',
    next: '을지로3가',
    transfer: [],
  },
  을지로입구: {
    prev: '시청',
    next: '을지로3가',
    transfer: [],
  },
  을지로3가: {
    prev: '을지로입구(IBK기업은행)',
    next: '을지로4가',
    transfer: ['3호선'],
  },
  을지로4가: {
    prev: '을지로3가',
    next: '동대문역사문화공원(DDP)',
    transfer: ['5호선'],
  },
  '동대문역사문화공원(DDP)': {
    prev: '을지로4가',
    next: '신당',
    transfer: ['4호선', '5호선'],
  },
  동대문역사문화공원: {
    prev: '을지로4가',
    next: '신당',
    transfer: ['4호선', '5호선'],
  },
  신당: {
    prev: '동대문역사문화공원(DDP)',
    next: '상왕십리',
    transfer: ['6호선'],
  },
  상왕십리: {
    prev: '신당',
    next: '왕십리(성동구청)',
    transfer: [],
  },
  '왕십리(성동구청)': {
    prev: '상왕십리',
    next: '한양대',
    transfer: ['경의·중앙선', '5호선', '수인·분당선'],
  },
  왕십리: {
    prev: '상왕십리',
    next: '한양대',
    transfer: ['경의·중앙선', '5호선', '수인·분당선'],
  },
  한양대: {
    prev: '왕십리(성동구청)',
    next: '뚝섬',
    transfer: [],
  },
  뚝섬: {
    prev: '한양대',
    next: '성수',
    transfer: [],
  },
  성수: {
    prev: '뚝섬',
    next: '건대입구',
    transfer: ['2호선(성수지선)'],
  },
  건대입구: {
    prev: '성수',
    next: '구의(광진구청)',
    transfer: ['7호선'],
  },
  '구의(광진구청)': {
    prev: '건대입구',
    next: '강변(동서울터미널)',
    transfer: [],
  },
  구의: {
    prev: '건대입구',
    next: '강변(동서울터미널)',
    transfer: [],
  },
  '강변(동서울터미널)': {
    prev: '구의(광진구청)',
    next: '잠실나루',
    transfer: [],
  },
  강변: {
    prev: '구의(광진구청)',
    next: '잠실나루',
    transfer: [],
  },
  잠실나루: {
    prev: '강변(동서울터미널)',
    next: '잠실(송파구청)',
    transfer: [],
  },
  '잠실(송파구청)': {
    prev: '잠실나루',
    next: '잠실새내',
    transfer: ['8호선'],
  },
  잠실: {
    prev: '잠실나루',
    next: '잠실새내',
    transfer: ['8호선'],
  },
  잠실새내: {
    prev: '잠실(송파구청)',
    next: '종합운동장',
    transfer: [],
  },
  종합운동장: {
    prev: '잠실새내',
    next: '삼성(무역센터)',
    transfer: ['9호선'],
  },
  '삼성(무역센터)': {
    prev: '종합운동장',
    next: '선릉',
    transfer: ['8호선'],
  },
  삼성: {
    prev: '종합운동장',
    next: '선릉',
    transfer: ['8호선'],
  },
  선릉: {
    prev: '삼성(무역센터)',
    next: '역삼',
    transfer: ['수인·분당선'],
  },
  역삼: {
    prev: '삼성(무역센터)',
    next: '강남',
    transfer: ['수인·분당선'],
  },
  강남: {
    prev: '역삼',
    next: '교대(법원·검찰청)',
    transfer: ['수인·분당선'],
  },
  '교대(법원·검찰청)': {
    prev: '강남',
    next: '서초',
    transfer: ['3호선'],
  },
  교대: {
    prev: '강남',
    next: '서초',
    transfer: ['3호선'],
  },
  서초: {
    prev: '교대(법원·검찰청)',
    next: '방배(백석예술대)',
    transfer: [],
  },
  '방배(백석예술대)': {
    prev: '서초',
    next: '사당(대항병원)',
    transfer: [],
  },
  방배: {
    prev: '서초',
    next: '사당(대항병원)',
    transfer: [],
  },
  '사당(대항병원)': {
    prev: '방배(백석예술대)',
    next: '낙성대(강감찬)',
    transfer: ['4호선'],
  },
  사당: {
    prev: '방배(백석예술대)',
    next: '낙성대(강감찬)',
    transfer: ['4호선'],
  },
  '낙성대(강감찬)': {
    prev: '사당(대항병원)',
    next: '서울대입구(관악구청)',
    transfer: [],
  },
  낙성대: {
    prev: '사당(대항병원)',
    next: '서울대입구(관악구청)',
    transfer: [],
  },
  '서울대입구(관악구청)': {
    prev: '낙성대(강감찬)',
    next: '봉천',
    transfer: [],
  },
  서울대입구: {
    prev: '낙성대(강감찬)',
    next: '봉천',
    transfer: [],
  },
  봉천: {
    prev: '서울대입구(관악구청)',
    next: '신림(양지병원)',
    transfer: [],
  },
  '신림(양지병원)': {
    prev: '서초',
    next: '신대방',
    transfer: [],
  },
  신림: {
    prev: '서초',
    next: '신대방',
    transfer: [],
  },
  신대방: {
    prev: '신림(양지병원)',
    next: '난곡지선',
    transfer: [],
  },
  난곡지선: {
    prev: '신대방',
    next: '구로디지털단지(원광디지털대)',
    transfer: [],
  },
  '구로디지털단지(원광디지털대)': {
    prev: '난곡지선',
    next: '대림(구로구청)',
    transfer: ['7호선'],
  },
  구로디지털단지: {
    prev: '난곡지선',
    next: '대림(구로구청)',
    transfer: ['7호선'],
  },
  '대림(구로구청)': {
    prev: '구로디지털단지(원광디지털대)',
    next: '신도림',
    transfer: ['7호선'],
  },
  대림: {
    prev: '구로디지털단지(원광디지털대)',
    next: '신도림',
    transfer: ['7호선'],
  },
  신도림: {
    prev: '대림(구로구청)',
    next: '문래',
    transfer: ['1호선', '2호선(신정지선)'],
  },
  문래: {
    prev: '신도림',
    next: '영등포구청',
    transfer: ['수인·분당선'],
  },
  영등포구청: {
    prev: '문래',
    next: '당산',
    transfer: ['5호선'],
  },
  당산: {
    prev: '영등포구청',
    next: '합정(홀트아동복지회)',
    transfer: ['9호선'],
  },
  '합정(홀트아동복지회)': {
    prev: '당산',
    next: '홍대입구',
    transfer: ['6호선'],
  },
  합정: {
    prev: '당산',
    next: '홍대입구',
    transfer: ['6호선'],
  },
  홍대입구: {
    prev: '합정(홀트아동복지회)',
    next: '신촌',
    transfer: ['경의·중앙선', '공항철도'],
  },
  신촌: {
    prev: '홍대입구',
    next: '이대',
    transfer: [],
  },
  이대: {
    prev: '신촌',
    next: '아현(추계예술대)',
    transfer: [],
  },
  '아현(추계예술대)': {
    prev: '이대',
    next: '충정로(경기대입구)',
    transfer: [],
  },
  아현: {
    prev: '이대',
    next: '충정로(경기대입구)',
    transfer: [],
  },
  '충정로(경기대입구)': {
    prev: '아현(추계예술대)',
    next: '시청',
    transfer: ['5호선'],
  },
  충정로: {
    prev: '아현(추계예술대)',
    next: '시청',
    transfer: ['5호선'],
  },
};

export const MAIN_LINE2 = '2호선 본선';
export const MY_ROUTE = '내 길';

export enum Direction {
  CW = '내선순환',
  CCW = '외선순환',
  INNER = '내선순환',
  OUTER = '외선순환',
}

export enum Selecting {
  NONE = null,
  ORIGIN = 1,
  DESTINATION = 2,
  DIRECTION = 3,
  GLOBAL_FILTER = 4,
}

export const chevronDownSettings = {
  strokeWidth: 2,
  color: 'black',
  height: 15,
};

export const iconSettings = {
  strokeWidth: 1.3,
  color: 'black',
  height: 25,
};

export const shadowProp = {
  shadowOffset: {height: 1, width: 1},
  shadowColor: 'gray',
  shadowOpacity: 0.5,
  shadowRadius: 3,
};

export const SEOUL_METRO_PHONE_1TO8 = '1577-1234';

export const REPORT = 'REPORT';
export const SUNGAN = 'SUNGAN';
export const PLACE = 'PLACE';
