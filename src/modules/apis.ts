import urljoin from 'url-join';

const BASE_URL = 'https://www.metasgid.com';
const toUrl = (...args) => ({url: urljoin(...args)});
const base = path => toUrl(BASE_URL, path);
const v1 = path => toUrl(BASE_URL, '/api/v1', path);

const APIS = {
  autocomplete: {
    get: ({ language, input, sessiontoken, force }) => v1(`/route/autocomplete?language=${language}&input=${input}&sessiontoken=${sessiontoken}&force=${force}`),
  },
  directions: {
    get: ({ origin, destination, mode, language, region, alternatives, transitMode, sessiontoken, force }) => v1(`/route/directions?origin=${origin}&destination=${destination}&mode=${mode}&language=${language}&region=${region}&alternatives=${alternatives}&transitRoutingPreference=fewer_transfers&transitMode=${transitMode}&sessiontoken=${sessiontoken}&force=${force}`),
  },
  route: {
    starred: () => v1('/route/starred'),
  },
  realtime: {
    position: () => v1('/route/realtime/position?startIndex=0&endIndex=100&service=realtimePosition&subwayNm=2호선'),
    arrival: (station) => v1(`/route/realtime/arrival?startIndex=0&endIndex=100&service=realtimeStationArrival&stationNm=${station}`),
  },
  post: {
    main: () => v1('/post/main'),
    sungan: () => v1('/post/sungan'),
    report: () => v1('/post/report'),
    place: () => v1('/post/place'),
    placeComments: (id) => v1(`/post/place/${id}/comments`),
    sunganComments: (id) => v1(`/post/sungan/${id}/comments`),
    reportComments: (id) => v1(`/post/report/${id}/comments`),
    placeComment: () => v1(`/post/place/comment`),
    sunganComment: () => v1(`/post/sungan/comment`),
    reportComment: () => v1(`/post/report/comment`),
    placeLike: (id) => v1(`/post/place/${id}/like`),
    sunganLike: (id) => v1(`/post/sungan/${id}/like`),
    reportLike: (id) => v1(`/post/report/${id}/like`),
  },
  auth: {
    signIn: () => v1('/auth/log-in'),
  },
  profile: {
    get: () => v1('/auth'),
  },
};

const mapFunctionToPath = (data, path = []) => {
  data &&
    Object.entries(data).map(([key, v]) => {
      if (typeof v === 'function') {
        const apiKey = [...path, key].join('.');
        data[key] = (...args) => ({...v(...args), key: apiKey});
        Object.defineProperty(data[key], '_apiKey', {value: apiKey});
      } else if (typeof v === 'object') {
        mapFunctionToPath(v, [...path, key]);
      }
    });
};
(function () {
  mapFunctionToPath(APIS, ['APIS']);
})();

export default APIS;
