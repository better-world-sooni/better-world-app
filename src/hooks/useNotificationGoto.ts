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
    
        if(event === 'like_post' || 'like_comment' || 'comment' ){
            
            // const gotoPost = useGotoPost({postId: post_id})
            // gotoPost()
            console.log("hi")
        } 
        else if(event === 'follow' || 'hug') {
            // const nft = {
            //     contract_address: contract_address,
            //     token_id: token_id,
            //     name: name,
            //     image_uri: image_uri,
            //     nft_metadatum: {
            //         name: meta_name,
            //         image_uri: meta_image_uri,
            //     },
            // }
            // apiGETWithToken(
            //     apis.nft.contractAddressAndTokenId(
            //         nft.contract_address,
            //         nft.token_id,
            //     ),
            // );
            // apiGETWithToken(
            //     apis.post.list.nft(nft.contract_address, nft.token_id)
            // );
            // notificationNavigate(NAV_NAMES.OtherProfile, {nft})
            console.log("hereee")
        }
    }
    return gotoWithNotification
}   