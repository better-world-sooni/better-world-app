import apis from "src/modules/apis";
import { NAV_NAMES } from "src/modules/navNames";
import { useApiGETWithToken } from "src/redux/asyncReducer";
import {navigationRef, notificationNavigate} from 'src/utils/notificationUtils';
import { ChatRoomEnterType } from "src/screens/ChatRoomScreen";
import { CommonActions } from '@react-navigation/native';

export function useGotoWithNotification() {
    const apiGETWithToken = useApiGETWithToken()
    const gotoWithNotification = (notificationData) => {
        const {
            event, 
            post_id,
            comment_id,
            room_id,
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
        else if(event === 'chat') {
            apiGETWithToken(apis.chat.chatRoom.roomId(room_id));     
            const params = {
                roomId: room_id,
                roomName: name || meta_name,
                roomImage: image_uri || meta_image_uri,
                opponentNft: {
                    contract_address: contract_address,
                    token_id: token_id
                },
                chatRoomEnterType: ChatRoomEnterType.Notification,
            }
            notificationNavigate(NAV_NAMES.ChatRoom, params)
        }
    }
    return gotoWithNotification
}   