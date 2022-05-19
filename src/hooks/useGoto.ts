import { useNavigation } from "@react-navigation/native";
import apis from "src/modules/apis";
import { NAV_NAMES } from "src/modules/navNames";
import { useApiGETWithToken, useApiPOSTWithToken } from "src/redux/asyncReducer";
import { ChatRoomType } from "src/screens/ChatRoomScreen";

export function useGotoNftProfile({contractAddress, tokenId}){
    const apiGETWithToken = useApiGETWithToken()
    const navigation = useNavigation()
    const gotoProfile = () => {
        apiGETWithToken(
            apis.nft.contractAddressAndTokenId(
                contractAddress,
              tokenId,
            ),
          );
          navigation.navigate(NAV_NAMES.OtherProfile, {
            contractAddress,
            tokenId
          });
      }
      return gotoProfile
}

export function useGotoProfile(){
  const navigation = useNavigation()
  const gotoProfile = () => {
        navigation.navigate(NAV_NAMES.Profile);
    }
    return gotoProfile
}

export function useGotoChatList(){
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoChatList = () => {
      apiGETWithToken(
        apis.chat.chatRoom.all()
      );
      navigation.navigate(NAV_NAMES.ChatList);
    }
    return gotoChatList
}

export function useGotoChatRoom({chatRoomType}){
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const apiPOSTWithToken = useApiPOSTWithToken()
  const gotoChatRoomWithRoomId = ({roomId}: any) => {
    apiGETWithToken(
      apis.chat.chatRoom.roomId(
          roomId
      ),
    );
      navigation.navigate(NAV_NAMES.ChatRoom, {
        roomId,
        chatRoomType
      });
  }
  const gotoChatRoomAsDirectMessage = ({contractAddress, tokenId}: any)  => {
    apiPOSTWithToken(
      apis.chat.chatRoom.contractAddressAndTokenId(
        contractAddress,
        tokenId
      ),
    );
      navigation.navigate(NAV_NAMES.ChatRoom, {
        contractAddress,
        tokenId,
        chatRoomType
        
      });
  }
  return chatRoomType == ChatRoomType.RoomId ? gotoChatRoomWithRoomId : gotoChatRoomAsDirectMessage
}

export function useGotoNftCollectionProfile({contractAddress}){
    const apiGETWithToken = useApiGETWithToken()
    const navigation = useNavigation()
    const gotoProfile = () => {
        apiGETWithToken(
            apis.nft_collection.contractAddress.profile(
                contractAddress
            ),
          );
          navigation.navigate(NAV_NAMES.NftCollection, {
            contractAddress
          });
      }
      return gotoProfile
}

export function useGotoPost({postId}){
  const apiGETWithToken = useApiGETWithToken()
  const navigation = useNavigation()
  const gotoPost = () => {
    apiGETWithToken(apis.post.postId._(postId));
    navigation.navigate(NAV_NAMES.Post, {postId});
  }
  return gotoPost
}

export function useGotoNewPost({postOwnerType}){
  const navigation = useNavigation()
  const gotoPost = () => {
    navigation.navigate(NAV_NAMES.NewPost, {postOwnerType});
  }
  return gotoPost
}

export function useGotoCapsule({nft}) {
  const navigation = useNavigation()
  const gotoCapsule = () => {
    navigation.navigate(NAV_NAMES.Capsule, {
      nft,
    })
  };
  return gotoCapsule
}

export function useGotoReport({id, reportType}){
  const navigation = useNavigation()
  const gotoReport = () => {
    navigation.navigate(NAV_NAMES.Report, {
      id,
      reportType
    })
  }
  return gotoReport
}