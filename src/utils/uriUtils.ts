import { Platform } from "react-native"

export const GATEWAY_PREFIX = "https://betterworld.mypinata.cloud/ipfs"

export const resizeImageUri = (uri: string, width: number, height: number) => {
    if(!uri) return null
    const url = new URL(uri)
    return `${url.origin}/${width}x${height}${url.pathname}`
}

export const klipApp2AppRequestUrl = (requestKey) => {
    return Platform.OS == 'ios' ? `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=a2a?request_key=${requestKey}` : `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${requestKey}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`
}

export const klipAppDownloadUrl = () => {
    return Platform.OS == 'ios' ? 'https://apps.apple.com/kr/app/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-kakaotalk/id362057947' : 'https://play.google.com/store/apps/details?id=com.kakao.talk'
}

export const kaikasApp2AppRequestUrl = (requestKey) => {
    return Platform.OS == 'ios' ? `kaikas://wallet/api?request_key=${requestKey}` : `kaikas://wallet/api?request_key=${requestKey}`
}

export const kaikasAppDownloadUrl = () => {
    return Platform.OS == 'ios' ? 'https://apps.apple.com/kr/app/kaikas-mobile-crypto-wallet/id1626107061' : 'https://play.google.com/store/apps/details?id=io.klutch.wallet'
}

export const removeQueryFromUri = (uri: string) => {
    if(!uri) return null
    return uri.split("?")[0]
}
export const getKeyFromUri = (uri: string) => {
    if(!uri) return null
    const url = new URL(uri)
    return url.pathname.slice(1)
}