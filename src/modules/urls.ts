import urljoin from 'url-join';

const baseUrl = 'http://localhost:3100';
const toUrl = (...args) => urljoin(...args);
const base = path => toUrl(baseUrl, path);

export const urls = {
    index: () => base('/'),
    home: () => base('/home'),
    feed: () => base('/feed'),
    post: {
        index: () => base(`/post`),
        postId: (postId, section = "#") => base(`/post/${postId}${section}`),
        admin: {
            contractAddress:  (contractAddress) => base(`/post/admin/${contractAddress}`)
        }
    },
    onboarding: {
        index: () => base(`/onboarding`)
    },
    nftProfile: {
        contractAddressAndTokenId: (contractAddress, tokenId) => base(`/nft-profile/${contractAddress}/${tokenId}`),
        _: () => base(`/nft-profile`)
    },
    chat: {
        inbox: base('/chat/inbox'),
        room: (roomId) => base(`/chat/${roomId}`)
    },
    gomzSpace: '/gomz-space',
    nftCollection: {
        contractAddress: (contractAddress) => base(`/nft-collection/${contractAddress}`)
    }
}