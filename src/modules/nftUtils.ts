import { resizeImageUri } from "./uriUtils"

export function getNftProfileImage(nft, width=null, height= null){
    if(nft.image_uri){
        if(width && height){
            return resizeImageUri(nft.image_uri, width, height)
        }
        return nft.image_uri
    }
    return nft.nft_metadatum.image_uri
}

export function getNftName(nft){
    return nft.name || nft.nft_metadatum.name
}

export function truncateAddress(fullStr, strLen = 12, separator = '...') {
    if (fullStr.length <= strLen) return fullStr;
  
    var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);
  
    return (
      fullStr.substr(0, frontChars) +
      separator +
      fullStr.substr(fullStr.length - backChars)
    );
}
