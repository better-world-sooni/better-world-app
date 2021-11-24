import React from 'react';
import {hasNotch} from 'react-native-device-info';
import {Span} from 'src/components/common/Span';
export const IOS_APP_VERSION = '6.0.5';
export const ANDROID_APP_VERSION = '6.0.5';
export const IOS_CODE_PUSH_VERSION = '117';
export const ANDROID_CODE_PUSH_VERSION = '45';
export const JWT_TOKEN = 'jwt_token';
export const HAS_NOTCH = hasNotch();
export const GO_COLOR = 'rgb(10, 96, 254)';
export const LINE2_Linked_List = new Map(
  Object.entries({
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
      prev: '선릉',
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
      prev: '봉천',
      next: '신대방',
      transfer: [],
    },
    신림: {
      prev: '봉천',
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
  }),
);

export const GRAY_COLOR = 'rgb(199,199,204)';
export const MAIN_LINE2 = '전체';
export const MY_ROUTE = '설정된 길';
export const LINE2_COLOR = 'rgb(51, 162, 60)';
export const LINE2_COLOR_LIGHT = 'rgba(51, 162, 60, 0.5)';

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
  strokeWidth: 3,
  color: 'black',
  height: 15,
  width: 15,
};

export const iconSettings = {
  strokeWidth: 1.3,
  color: 'black',
  height: 24,
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

export const TRAIN_STATE = {
  '0': '진입',
  '1': '도착',
};

export const characterDesc = new Map(
  Object.entries({
    alien: {
      span: (
        <>
          <Span>방사능 마니아 </Span>
          <Span bold>애일리언</Span>
        </>
      ),
    },
    blue: {
      span: (
        <>
          <Span>파란색 분장 </Span>
          <Span bold>블루</Span>
        </>
      ),
    },
    brother: {
      span: (
        <>
          <Span>콜 미 </Span>
          <Span bold>브라더</Span>
        </>
      ),
    },
    clown: {
      span: (
        <>
          <Span>무서운척 하는 쫄보 </Span>
          <Span bold>클라운</Span>
        </>
      ),
    },
    dark: {
      span: (
        <>
          <Span>내 옷장은 오직 검은색 </Span>
          <Span bold>다크</Span>
        </>
      ),
    },
    enchantress: {
      span: (
        <>
          <Span>마술에 푹 빠진 </Span>
          <Span bold>인챈트리스</Span>
        </>
      ),
    },
    footballer: {
      span: (
        <>
          <Span>한국 최강 쿼터백 </Span>
          <Span bold>풋볼러</Span>
        </>
      ),
    },
    fromTheFuture: {
      span: (
        <>
          <Span>다음 로또 번호 물어봐라 </Span>
          <Span bold>프럼 더 퓨쳐</Span>
        </>
      ),
    },
    geek: {
      span: (
        <>
          <Span>(INTP) 자발적 외톨이 </Span>
          <Span bold>긱</Span>
        </>
      ),
    },
    guy: {
      span: (
        <>
          <Span>후 이즈 댓 </Span>
          <Span bold>가이</Span>
        </>
      ),
    },
    irishMan: {
      span: (
        <>
          <Span>싸움 좀 치는 </Span>
          <Span bold>아이리쉬맨</Span>
        </>
      ),
    },
    kev: {
      span: (
        <>
          <Span>지디와 맞먹는 패셔니스타 (본인피셜) </Span>
          <Span bold>케브</Span>
        </>
      ),
    },
    kimono: {
      span: (
        <>
          <Span>옷은 별로지만 만화 덕후 </Span>
          <Span bold>키모노</Span>
        </>
      ),
    },
    madScientist: {
      span: (
        <>
          <Span>지식에 미쳐버린 </Span>
          <Span bold>매드 사이언티스트</Span>
        </>
      ),
    },
    naked: {
      span: (
        <>
          <Span>내추럴리스트 </Span>
          <Span bold>네이키드</Span>
        </>
      ),
    },
    oldMan: {
      span: (
        <>
          <Span>125세 갑부 </Span>
          <Span bold>올드맨</Span>
        </>
      ),
    },
    pineappleHead: {
      span: (
        <>
          <Span>한국 토종 원주민 </Span>
          <Span bold>파인애플해드</Span>
        </>
      ),
    },
    playboyGirl: {
      span: (
        <>
          <Span>핫핫! </Span>
          <Span bold>플래이보이걸</Span>
        </>
      ),
    },
    princess: {
      span: (
        <>
          <Span>레드카펫 어딨어?! </Span>
          <Span bold>프린세스</Span>
        </>
      ),
    },
    q: {
      span: (
        <>
          <Span>도라에몽급 가젯 마스터 </Span>
          <Span bold>큐</Span>
        </>
      ),
    },
    statueOfLiberty: {
      span: (
        <>
          <Span>뉴욕 피자만 먹는 </Span>
          <Span bold>자유의 여신상</Span>
        </>
      ),
    },
    telekinesis: {
      span: (
        <>
          <Span>? </Span>
          <Span bold>텔레키네시스</Span>
        </>
      ),
    },
    vampire: {
      span: (
        <>
          <Span>선지가 좋아 </Span>
          <Span bold>뱀파이어</Span>
        </>
      ),
    },
    zAfro: {
      span: (
        <>
          <Span>왕년에 헤어스타일스트 했던 좀비 </Span>
          <Span bold>Z Afro</Span>
        </>
      ),
    },
    zBangs: {
      span: (
        <>
          <Span>이모 좀비 </Span>
          <Span bold>Z Bangs</Span>
        </>
      ),
    },
    zBloodyLeftHead: {
      span: (
        <>
          <Span>왼쪽 머리 외상 좀비 </Span>
          <Span bold>Z Bloody Left Head</Span>
        </>
      ),
    },
    zBloodyMouth: {
      span: (
        <>
          <Span>좀비병 말기 </Span>
          <Span bold>Z Bloody Mouth</Span>
        </>
      ),
    },
    zBloodyRightHead: {
      span: (
        <>
          <Span>오른쪽 머리 외상 좀비 </Span>
          <Span bold>Z Bloody Right Head</Span>
        </>
      ),
    },
    zNormal: {
      span: (
        <>
          <Span>좀비 영화 엑스트라 </Span>
          <Span bold>Z Normal</Span>
        </>
      ),
    },
  }),
);

export enum Validity {
  NULL = null,
  ZERO = 0,
  VALID = 1,
  INVALID = 2,
}

export const shortenStations = arr => {
  return arr.map(station => {
    return station.split('(')[0];
  });
};

export const postShadowProp = opacity => {
  return {
    shadowOffset: {height: 1, width: 1},
    shadowColor: GRAY_COLOR,
    shadowOpacity: opacity,
    shadowRadius: 10,
  };
};

export const WS_URL = 'https://ws.metasgid.com';
// export const WS_URL = 'http://localhost:8000';

export enum ChannelFilter {
  ALL = 0,
  EVENTS = 2,
  MUSIC = 1,
  TALK = 3,
  REPORT = 5,
  PLACE = 6,
}

export const NUM_OF_LINES_ON_POST = 5;