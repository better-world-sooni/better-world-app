import urljoin from 'url-join';

// const BASE_URL = 'https://api.metasgid.com';
const BASE_URL = 'http://localhost:3000';
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
    notification: () => v1('/route/notification')
  },
  realtime: {
    position: () => v1('/route/realtime/position?startIndex=0&endIndex=100&service=realtimePosition&subwayNm=2호선'),
    arrival: (station) => v1(`/route/realtime/arrival?startIndex=0&endIndex=100&service=realtimeStationArrival&stationNm=${station}`),
  },
  post: {
    main: () => v1('/post/main'),
    before: (firstId) => v1(`/post/main/before?firstId=${firstId}`),
    after: (lastId) => v1(`/post/main/after?lastId=${lastId}`),
    sungan: {
      main: () => v1('/post/sungan'),
      id: (id) => v1(`/post/sungan/${id}`),
      my: () => v1('/post/sungan/my'),
      comments: (id) => v1(`/post/sungan/${id}/comments`),
      comment: {
        main: () => v1(`/post/comment`),
        like: () => v1(`/post/comment/like`),
        delete: (id) => v1(`/post/comment/${id}`),
        unlike: (id) => v1(`/post/comment/like/${id}`),
        reply: {
          main: (id) => v1(`/post/comment/${id}/reply`),
          delete: (id) => v1(`/post/comment/reply/${id}`)
        },
      },
      like: (id) => v1(`/post/likes/${id}`),
    },
    report: {
      main: () => v1('/post/report'),
      id: (id) => v1(`/post/report/${id}`),
      comments: (id) => v1(`/post/report/${id}/comments`),
      comment: {
        main: () => v1(`/post/report/comment`),
        like: (id) => v1(`/post/report/comment/${id}/like`),
        delete: (id) => v1(`/post/report/comment/${id}`),
        reply: {
          main: () => v1(`/post/report/comment/reply`),
          delete: (id) => v1(`/post/report/comment/reply/${id}`),
        } 
      },
      like: (id) => v1(`/post/report/${id}/like`),
    },
    place: {
      main: () => v1('/post/place'),
      id: (id) => v1(`/post/place/${id}`),
      comments: (id) => v1(`/post/place/${id}/comments`),
      comment: {
        main: () => v1(`/post/place/comment`),
        like: (id) => v1(`/post/place/comment/${id}/like`),
        delete: (id) => v1(`/post/place/comment/${id}`),
        reply: {
          main: () => v1(`/post/place/comment/reply`),
          delete: (id) => v1(`/post/place/comment/reply/${id}`),
        }
      },
      like: (id) => v1(`/post/place/${id}/like`),
    },
  },
  auth: {
    email: {
      signin: () => v1('/auth/email/signin')
    },
    usernameValidity: (id) => v1(`/auth/username-validity?value=${id}`),
    signIn: () => v1('/auth/log-in'),
    signUp: () => v1('/auth/sign-up'),
    avatar: () => v1('/auth/avatar'),
    user: (token) => v1(`/auth/user?jwtToken=${token}`),
  },
  profile: {
    userUuid: (userUuid) => v1(`/profile?user_uuid=${userUuid}`),
    my: () => v1(`/profile`),
  },
  push: {
    registrationToken: () => v1('/push/registration-token'),
    notification: {
      user: () => v1('/push/notifications/user'),
    }
  },
  chat: {
    chat: (category, roomId) => v1(`/chat/room?category=${category}&roomId=${roomId}`),
    chatRoom: {
      main: () => v1(`/chat/room/all`),
      user: () => v1(`/chat/chatRoom/user`),
    }
  }
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
