import urljoin from 'url-join';
import querystring from 'querystring'
import {isEmpty, omitBy, isNil} from 'lodash'

// const BASE_URL = 'http://3.39.22.255:3000';
// const BASE_URL = 'http://192.168.1.185:3000';
// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://api.betterworldapp.io';

const toUrl = (...args) => ({url: urljoin(...args)});
const apiV1 = path => toUrl(BASE_URL, '/api/v1', path);

export const urlParams = (obj, nullable?) => {
  if (nullable) {
    return isEmpty(obj) ? '' : '?' + querystring.stringify(obj)
  }
  const nilRemoved = omitBy(obj, isNil)
  if (isEmpty(nilRemoved)) {
    return ''
  }
  return '?' + querystring.stringify(nilRemoved)
}

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
    jwt: {
      _: () => apiV1('/auth/jwt'),
      qr: {
        _: () => apiV1('/auth/jwt/qr'),
        login: (token) => apiV1(`/auth/jwt/qr/login${urlParams({token})}`)
      }
    },
  },
  pushNotificationSetting: {
    _: () => apiV1(`/push_notification_setting`),
    registrationToken: () => apiV1(`/push_notification_setting/registration_token`)
  },
  profile: {
    klaytnAddress: (klaytnAddress) => apiV1(`/profile/${klaytnAddress}`),
    _: () => apiV1(`/profile`)
  },
  hug: {
    qr: () => apiV1(`/hug/qr`),
  },
  rankDeltum: {
    list: (contractAddress, tokenId, page?) => apiV1(`/rank_deltum/${contractAddress}/${tokenId}/list${urlParams({page})}`)
  },
  notification: {
    list: {
      _: (page?) => apiV1(`/notification/list${urlParams({page})}`),
      unreadCount: () => apiV1(`/notification/list/unread_count`)
    }
  },
  nft: {
    contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/nft/${contractAddress}/${tokenId}`),
    qr: (token) => apiV1(`/nft/qr?token=${token}`),
    _: () => apiV1(`/nft`),
    order: {
      list: (page?) => apiV1(`/nft/order/list${urlParams({page})}`),
    },
    coupon: {
      list: (page?) => apiV1(`/nft/coupon/list${urlParams({page})}`),
    },
  },
  follow: {
    contractAddressAndTokenId: (contractAddress, tokenId?) => tokenId ? apiV1(`/follow/${contractAddress}/${tokenId}`) : apiV1(`/follow/${contractAddress}`),
    contractAddress: (contractAddress) => apiV1(`/follow/${contractAddress}`),
    list: (getFollowers, contractAddress, tokenId?, page?) => apiV1(`/follow/list${urlParams({get_followers: getFollowers, contract_address: contractAddress, token_id: tokenId, page})}`)
  },
  nft_collection: {
    _: () => apiV1(`/nft_collection`),
    communityWallet: {
      list: (page?) => apiV1(`/nft_collection/community_wallet/list${urlParams({page})}`),
    },
    collectionEvent: {
      list: (page?) => apiV1(`/nft_collection/collection_event/list${urlParams({page})}`),
    },
    merchandise: {
      list: (page?) => apiV1(`/nft_collection/merchandise/list${urlParams({page})}`),
    },
    order: {
      list: (page?) => apiV1(`/nft/order/list${urlParams({page})}`),
    },
    contractAddress: {
      _: (contractAddress) => apiV1(`/nft_collection/${contractAddress}`),
      communityWallet: {
        list: (contractAddress, page?) => apiV1(`nft_collection/${contractAddress}/community_wallet/list${urlParams({page})}`),
      },
      collectionEvent: {
        list: (contractAddress, page?) => apiV1(`nft_collection/${contractAddress}/collection_event/list${urlParams({page})}`),
      },
      nft: {
        list: (contractAddress, keyword?, page?) => apiV1(`/nft_collection/${contractAddress}/nft/list${urlParams({keyword, page})}`)
      }
    },
  },
  community_wallet: {
    _: () => apiV1(`/community_wallet`),
    address: {
      _: (address) => apiV1(`/community_wallet/${address}`),
      transaction: {
        list: (address, cursor?) => apiV1(`/community_wallet/${address}/transaction/list${urlParams({cursor})}`),
      }
    }
  },
  forum_setting: {
    _: () => apiV1(`/forum_setting`)
  }, 
  social_setting: {
    _: () => apiV1(`/social_setting`)
  }, 
  comment: {
    post: (postId) => apiV1(`/comment/post/${postId}`),
    comment: (commentId) => apiV1(`/comment/comment/${commentId}`)
  },
  like: {
    post: (postId) => apiV1(`/like/post/${postId}`),
    comment: (commentId) => apiV1(`/like/comment/${commentId}`),
    list: (likableType, likableId, page?) => apiV1(`/like/${likableType}/${likableId}/list${urlParams({page})}`),
  },
  vote: {
    postId: (postId) => apiV1(`/vote/${postId}`),
    list: (voteCategory, postId, page?) => apiV1(`/vote/list${urlParams({page, post_id: postId, vote_category: voteCategory})}`),
  },
  rank:{
    list: (keyword?, page?) => apiV1(`/rank/list${urlParams({page, keyword})}`)
  },
  merchandise: {
    _: () => apiV1(`/merchandise`),
    merchandiseId: (merchandiseId) => apiV1(`/merchandise/${merchandiseId}`),
  },
  order: {
    _: () => apiV1(`/order`),
    list: () => apiV1(`/order/list`),
    orderId: (orderId) => apiV1(`/order/${orderId}`),
  },
  coupon: {
    list: () => apiV1(`/coupon/list`),
  },
  post: {
    _: () => apiV1(`/post`),
    postId: {
      _: (postId) => apiV1(`/post/${postId}`),
      comment: {
        list: (postId, page?) => apiV1(`/post/${postId}/comment/list${urlParams({page})}`)
      },
      repost: {
        list: {
          _: (postId, page?) => apiV1(`/post/${postId}/repost/list${urlParams({page})}`),
          proposal: (postId, page?) => apiV1(`/post/${postId}/repost/list/proposal${urlParams({page})}`),
        }
      }
    },
    list: {
      _: (page?) => apiV1(`/post/list/nft${urlParams({page})}`),
      nft: (contractAddress, tokenId, page?) => apiV1(`/post/list/nft${urlParams({contract_address: contractAddress, token_id: tokenId, page})}`),
      nftCollection: (contractAddress, page?) => apiV1(`/post/list/nft_collection${urlParams({contract_address: contractAddress, page})}`)
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
  blockchain_transaction: {
    _:(transactionHash) => apiV1(`/blockchain_transaction/${transactionHash}`),
  },
  feed: {
    _: (page?) => apiV1(`/feed${urlParams({page})}`),
    count: () => apiV1(`/feed/count`),
    forum: (filter?, page?) => apiV1(`/feed/forum${urlParams({page, filter})}`),
    social: (filter?,page?) => apiV1(`/feed/social${urlParams({page, filter})}`),
    collection: (contractAddress, type?, page?) => apiV1(`/feed/collection?contract_address${urlParams({contract_address: contractAddress, type, page})}`),
  },
  presignedUrl: {
    _: () => apiV1(`/presigned_url`)
  },
  chat: {
    chatRoom: {
      all: () => apiV1(`/chat/room/all`),
      contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/chat/room/${contractAddress}/${tokenId}`),
      roomId: (roomId) => apiV1(`/chat/room/${roomId}`),
    } 
  },
  collectionEvent: {
    _: () => apiV1(`/collection_event`),
    contractAddress: {
      list: (collectionEventId, page?) => apiV1(`/collection_event/${collectionEventId}/list${urlParams({page})}`),
    },
    collectionEventId: (collectionEventId) => apiV1(`/collection_event/${collectionEventId}`),
  },
  attendance: {
    collectionEventId: {
      _: (collectionEventId) => apiV1(`/attendance/${collectionEventId}`),
      list: (collectionEventId, attendanceCategory, page?) => apiV1(`/attendance/${collectionEventId}/list${urlParams({attendance_category: attendanceCategory, page})}`),
    },
  },
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
