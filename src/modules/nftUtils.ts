import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "src/redux/rootReducer"
import { resizeImageUri } from "./uriUtils"

export function getNftProfileImage(nft, width=null, height= null){
    if(!nft) return null
    if(nft.image_uri){
        if(width && height){
            return resizeImageUri(nft.image_uri, width, height)
        }
        return nft.image_uri
    }
    return nft?.nft_metadatum?.image_uri
}

export function getNftCollectionProfileImage(nftCollection, width=null, height= null){
    if(width && height){
        return resizeImageUri(nftCollection?.image_uri, width, height)
    }
    return nftCollection?.image_uri
}

export function getNftName(nft){
    if(!nft) return null
    return nft?.name || nft?.nft_metadatum.name
}
export function getNftStory(nft){
    if(!nft) return null
    return nft.story || nft.about
}

export function useIsCurrentNft(nft) {
    const {currentNft} = useSelector(
        (root: RootState) => root.app.session,
        shallowEqual,
    );
    const isCurrentNft = currentNft && nft ? (currentNft.contract_address == nft.contract_address && currentNft.token_id == nft.token_id) : false
    return isCurrentNft
}

export function useIsCurrentCollection(nftCollection) {
    const {currentNft} = useSelector(
        (root: RootState) => root.app.session,
        shallowEqual,
    );
    const isCurrentCollection = currentNft && nftCollection && currentNft.contract_address == nftCollection.contract_address
    return isCurrentCollection
}
export function useIsAdmin(nftCollection?) {
    const {currentNft} = useSelector(
        (root: RootState) => root.app.session,
        shallowEqual,
    );
    if(!nftCollection) return currentNft.privilege
    const isAdmin = currentNft && nftCollection && currentNft.contract_address == nftCollection.contract_address && currentNft.privilege == true
    return isAdmin
}
