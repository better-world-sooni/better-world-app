import urljoin from 'url-join';

// const BASE_URL = 'https://api.metasgid.com';
const BASE_URL = 'http://localhost:3000';
const toUrl = (...args) => ({url: urljoin(...args)});
const base = path => toUrl(BASE_URL, path);
const apiV1 = path => toUrl(BASE_URL, '/api/v1', path);
const apis = {
  auth: {
    kaikas: {
      verification: () => apiV1('/auth/kaikas/verification'),
      nonce: () => apiV1(`/auth/kaikas/nonce`),
    },
    klip: {
      verify: () =>apiV1('/auth/klip/verification')
    },
    password: {
      _: () => apiV1('/auth/password')
    },
    user: {
      _: () => apiV1('/auth/user')
    },
    jwt: () => apiV1('/auth/jwt')
  },
  pushNotificationSetting: {
    registrationToken: () => apiV1(`/push_notification_setting/registration_token`)
  },
  profile: {
    klaytnAddress: (klaytnAddress) => apiV1(`/profile/${klaytnAddress}`),
    _: () => apiV1(`/profile`)
  },
  search: {
    nft: (keyword) => apiV1(`/search/nft/${keyword}`)
  },
  nft: {
    contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/nft/${contractAddress}/${tokenId}`),
    _: () => apiV1(`/nft`)
  },
  follow: {
    contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/follow/${contractAddress}/${tokenId}`),
    contractAddress: (contractAddress) => apiV1(`/follow/${contractAddress}`)
  },
  nft_collection: {
    contractAddress: {
      _: (contractAddress) => apiV1(`/nft_collection/${contractAddress}`),
      profile: (contractAddress) => apiV1(`/nft_collection/${contractAddress}/profile`)
    }
  },
  comment: {
    post: (postId) => apiV1(`/comment/post/${postId}`),
    comment: (commentId) => apiV1(`/comment/comment/${commentId}`)
  },
  like: {
    post: (postId) => apiV1(`/like/post/${postId}`),
    comment: (commentId) => apiV1(`/like/comment/${commentId}`)
  },
  vote: {
    postId: (postId) => apiV1(`/vote/${postId}`),
  },
  rank:{
    all: (cwyear?, cweek?, keyword?) => cwyear && cweek ?  (keyword ? apiV1(`/rank/all?cwyear=${cwyear}&cweek=${cweek}&keyword=${keyword}`) : apiV1(`/rank/all?cwyear=${cwyear}&cweek=${cweek}`)) : apiV1(`/rank/all`)
  },
  post: {
    _: () => apiV1(`/post`),
    postId: {
      _: (postId) => apiV1(`/post/${postId}`),
      comment: (postId) => apiV1(`/post/${postId}/comment`)
    }
  },
  report: {
    post: {
      postId: (postId) => apiV1(`/report/post/${postId}`)
    },
    comment: {
      commentId: (commentId) => apiV1(`/report/comment/${commentId}`)
    }
  },
  feed: {
    _: () => apiV1(`/feed`),
  },
  presignedUrl: {
    _: () => apiV1(`/presigned_url`)
  },
  chat: {
    chatRoom: {
      all: () => apiV1(`chat/room/all`),
      contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/chat/room/${contractAddress}/${tokenId}`),
      roomId: (roomId) => apiV1(`/chat/room/${roomId}`),
    } 
  }
}

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
  mapFunctionToPath(apis, ['apis']);
})();

export default apis;
