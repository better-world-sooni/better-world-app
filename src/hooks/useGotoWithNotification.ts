import apis from "src/modules/apis";
import { NAV_NAMES } from "src/modules/navNames";
import { useApiGETWithToken, useApiPOSTWithToken, useApiGET } from "src/redux/asyncReducer";
import { notificationNavigate } from 'src/modules/rootNavagation';

export function useGotoWithNotification() {
    const apiGETWithToken = useApiGETWithToken()
    const gotoWithNotification = (notificationData) => {
        const {
            event, 
            post_id,
            comment_id,
            contract_address,
            token_id,
            name,
            image_uri,
            meta_name,
            meta_image_uri,
        } = notificationData
        if(['like_post', 'like_comment', 'comment'].includes(event)){
            apiGETWithToken(apis.post.postId._(post_id));
            notificationNavigate(NAV_NAMES.Post, {postId: post_id, autoFocus: false})
        } 
        else if(['follow', 'hug'].includes(event)) {
            const nft = {
                contract_address: contract_address,
                token_id: token_id,
                name: name,
                image_uri: image_uri,
                nft_metadatum: {
                    name: meta_name,
                    image_uri: meta_image_uri,
                },
            }
            apiGETWithToken(
                apis.nft.contractAddressAndTokenId(
                    nft.contract_address,
                    nft.token_id,
                ),
            );
            apiGETWithToken(
                apis.post.list.nft(nft.contract_address, nft.token_id)
            );
            notificationNavigate(NAV_NAMES.OtherProfile, {nft})
        }
    }
    return gotoWithNotification
}   