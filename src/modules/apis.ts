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
  post: {
    main: {
      before: (firstId) => v1(`/post/main/before?firstId=${firstId}`),
      after: (lastId) => v1(`/post/main/after?lastId=${lastId}`),
    }
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
