import { CommonActions, useNavigation } from "@react-navigation/native";
import { shallowEqual, useSelector } from "react-redux";
import apis from "src/modules/apis";
import { NAV_NAMES } from "src/modules/navNames";
import { useApiGETWithToken, useApiPOSTWithToken } from "src/redux/asyncReducer";
import { RootState } from "src/redux/rootReducer";
import { ChatRoomType } from "src/screens/ChatRoomScreen";
import { FollowOwnerType, FollowType } from "src/screens/FollowListScreen";

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
  const gotoChatRoomWithRoomId = ({roomName, roomImage, roomId}: any) => {
    apiGETWithToken(
      apis.chat.chatRoom.roomId(
          roomId
      ),
    );
      navigation.navigate(NAV_NAMES.ChatRoom, {
        roomName,
        roomImage,
        roomId,
        chatRoomType
      });
  }
  const gotoChatRoomAsDirectMessage = ({roomName, roomImage, contractAddress, tokenId}: any)  => {
    apiPOSTWithToken(
      apis.chat.chatRoom.contractAddressAndTokenId(
        contractAddress,
        tokenId
      ),
    );
      navigation.navigate(NAV_NAMES.ChatRoom, {
        roomName,
        roomImage,
        contractAddress,
        tokenId,
        chatRoomType
        
      });
  }
  return chatRoomType == ChatRoomType.RoomId ? gotoChatRoomWithRoomId : gotoChatRoomAsDirectMessage
}

export function useGotoNftCollectionProfile({contractAddress = null}){
    const apiGETWithToken = useApiGETWithToken()
    const navigation = useNavigation()
    const {currentNft} = useSelector(
      (root: RootState) => root.app.session,
      shallowEqual,
    );
    const gotoProfile = () => {
      apiGETWithToken(apis.nft_collection.contractAddress.profile(contractAddress || currentNft.contract_address));
      navigation.navigate(NAV_NAMES.NftCollection, {
        contractAddress:  contractAddress || currentNft.contract_address
      });
    }
    return gotoProfile
}

export function useGotoPost({postId}){
  const apiGETWithToken = useApiGETWithToken()
  const navigation = useNavigation()
  const gotoPost = (autoFocus=false) => {
    apiGETWithToken(apis.post.postId._(postId));
    navigation.navigate(NAV_NAMES.Post, {postId, autoFocus});
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

export function useGotoLikeList({likableType, likableId}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCapsule = () => {
    apiGETWithToken(
      apis.like.list(
        likableType, likableId
      ),
    );
    navigation.navigate(NAV_NAMES.LikeList, {
      likableType, likableId
    })
  };
  return gotoCapsule
}

export function useGotoVoteList({postId}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const useGotoVoteList = (voteCategory) => {
    apiGETWithToken(
      apis.vote.list(
        voteCategory, postId
      ),
    );
    navigation.navigate(NAV_NAMES.VoteList, {
      voteCategory, postId
    })
  };
  return useGotoVoteList
}

export function useGotoFollowList({followOwnerType, contractAddress, tokenId = null}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCapsule = (followType) => {
    apiGETWithToken(
      followOwnerType == FollowOwnerType.Nft
        ? apis.follow.list(
            followType == FollowType.Followers ? true : false,
            contractAddress,
            tokenId,
          )
        : apis.follow.list(
            followType == FollowType.Followers ? true : false,
            contractAddress,
          )
    );
    navigation.navigate(NAV_NAMES.FollowList, {followOwnerType, followType, contractAddress, tokenId})
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

export function useGotoQR(){
  const navigation = useNavigation()
  const apiPOSTWithToken = useApiPOSTWithToken()
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
);
  const gotoReport = () => {
    apiPOSTWithToken(apis.auth.qr(), {
      contract_address: currentNft.contract_address,
      token_id: currentNft.token_id
    })
    navigation.navigate(NAV_NAMES.Qr)
  }
  return gotoReport
}

export function useGotoRankSeason({cwyear, cweek}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const useGotoRankSeason = () => {
    apiGETWithToken(
      apis.rankSeason._(
        cwyear, cweek
      ),
    );
    navigation.navigate(NAV_NAMES.RankSeason)
  };
  return useGotoRankSeason
}

export function useGotoScan(){
  const navigation = useNavigation()
  const gotoScan = () => {
    navigation.navigate(NAV_NAMES.Scan)
  }
  return gotoScan
}

export function useGotoNotification() {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const useGotoNotification = () => {
    apiGETWithToken(
      apis.notification.list._()
    );
    navigation.navigate(NAV_NAMES.Notification)
  };
  return useGotoNotification
}

export function useGotoHome() {
  const navigation = useNavigation()
  const gotoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.Home}],
      }),
    );
  };
  return gotoHome
}

export function useGotoOnboarding() {
  const navigation = useNavigation()
  const gotoOnboarding = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.Onboarding}],
      }),
    );
  };
  return gotoOnboarding
}

export function useGotoRankDeltum({contractAddress, tokenId}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoRankDeltum = () => {
    apiGETWithToken(
      apis.rankDeltum.list(contractAddress, tokenId)
    );
    navigation.navigate(NAV_NAMES.RankDeltum, {contractAddress, tokenId})
  };
  return gotoRankDeltum
}

export function useGotoCollectionFeed({contractAddress}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCollectionFeed = (title, type?) => {
    apiGETWithToken(
      apis.feed.collection(contractAddress, type)
    );
    navigation.navigate(NAV_NAMES.CollectionFeed, {
      contractAddress,
      title
    })
  };
  return gotoCollectionFeed
}

