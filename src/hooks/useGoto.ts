import { CommonActions, useNavigation } from "@react-navigation/native";
import { shallowEqual, useSelector } from "react-redux";
import apis from "src/modules/apis";
import { NAV_NAMES } from "src/modules/navNames";
import { useApiGETWithToken, useApiPOSTWithToken } from "src/redux/asyncReducer";
import { RootState } from "src/redux/rootReducer";
import { ChatRoomType } from "src/screens/ChatRoomScreen";
import { FollowOwnerType, FollowType } from "src/screens/FollowListScreen";

export function useGotoNftProfile({nft}){
    const apiGETWithToken = useApiGETWithToken()
    const navigation = useNavigation()
    const gotoProfile = () => {
        apiGETWithToken(
            apis.nft.contractAddressAndTokenId(
              nft.contract_address,
              nft.token_id,
            ),
          );
          apiGETWithToken(
            apis.post.list.nft(nft.contract_address, nft.token_id)
          )
          navigation.navigate(NAV_NAMES.OtherProfile as never, {
            nft
          }as never);
      }
      return gotoProfile
}

export function useGotoProfile(){
  const navigation = useNavigation()
  const gotoProfile = () => {
        navigation.navigate(NAV_NAMES.Profile as never);
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
      navigation.navigate(NAV_NAMES.ChatList as never);
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
      navigation.navigate(NAV_NAMES.ChatRoom as never, {
        roomName,
        roomImage,
        roomId,
        chatRoomType
      } as never);
  }
  const gotoChatRoomAsDirectMessage = ({roomName, roomImage, contractAddress, tokenId}: any)  => {
    apiPOSTWithToken(
      apis.chat.chatRoom.contractAddressAndTokenId(
        contractAddress,
        tokenId
      ),
    );
      navigation.navigate(NAV_NAMES.ChatRoom as never, {
        roomName,
        roomImage,
        contractAddress,
        tokenId,
        chatRoomType
      } as never);
  }
  return chatRoomType == ChatRoomType.RoomId ? gotoChatRoomWithRoomId : gotoChatRoomAsDirectMessage
}

export function useGotoNftCollectionProfile({nftCollection}){
    const apiGETWithToken = useApiGETWithToken()
    const navigation = useNavigation()
    const gotoProfile = () => {
      apiGETWithToken(apis.nft_collection.contractAddress.profile(nftCollection.contract_address));
      navigation.navigate(NAV_NAMES.NftCollection as never, {
        nftCollection
      } as never);
    }
    return gotoProfile
}

export function useGotoPost({postId}){
  const apiGETWithToken = useApiGETWithToken()
  const navigation = useNavigation()
  const gotoPost = (autoFocus=false) => {
    apiGETWithToken(apis.post.postId._(postId));
    navigation.navigate(NAV_NAMES.Post as never, {postId, autoFocus} as never);
  }
  return gotoPost
}

export function useGotoNewPost({postOwnerType}){
  const navigation = useNavigation()
  const gotoNewPost = (repostable = null, collectionEvent = null) => {
    navigation.navigate(NAV_NAMES.NewPost as never, {postOwnerType, repostable, collectionEvent} as never);
  }
  return gotoNewPost
}

export function useGotoCapsule({nft}) {
  const navigation = useNavigation()
  const gotoCapsule = () => {
    navigation.navigate(NAV_NAMES.Capsule as never, {
      nft,
    } as never)
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
    navigation.navigate(NAV_NAMES.LikeList as never, {
      likableType, likableId
    } as never)
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
    navigation.navigate(NAV_NAMES.VoteList as never, {
      voteCategory, postId
    } as never)
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
            followType == FollowType.Followers,
            contractAddress,
            tokenId,
          )
        : apis.follow.list(
            followType == FollowType.Followers,
            contractAddress,
          )
    );
    navigation.navigate(NAV_NAMES.FollowList as never, {followOwnerType, followType, contractAddress, tokenId} as never)
  };
  return gotoCapsule
}

export function useGotoReport({id, reportType}){
  const navigation = useNavigation()
  const gotoReport = () => {
    navigation.navigate(NAV_NAMES.Report as never, {
      id,
      reportType
    } as never)
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
    navigation.navigate(NAV_NAMES.Qr as never)
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
    navigation.navigate(NAV_NAMES.RankSeason as never)
  };
  return useGotoRankSeason
}

export function useGotoScan({scanType}){
  const navigation = useNavigation()
  const gotoScan = () => {
    navigation.navigate(NAV_NAMES.Scan as never, {scanType} as never)
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
    navigation.navigate(NAV_NAMES.Notification as never)
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
    navigation.navigate(NAV_NAMES.RankDeltum as never, {contractAddress, tokenId} as never)
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
    navigation.navigate(NAV_NAMES.CollectionFeed as never, {
      contractAddress,
      title,
      type
    } as never)
  };
  return gotoCollectionFeed
}

export function useGotoForumFeed({postId}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCollectionFeed = (title) => {
    apiGETWithToken(
      apis.post.postId.repost.list.proposal(postId, 1)
    );
    navigation.navigate(NAV_NAMES.ForumFeed as never, {
      postId,
      title
    } as never)
  };
  return gotoCollectionFeed
}

export function useGotoRepostList({postId}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCollectionFeed = (title) => {
    apiGETWithToken(
      apis.post.postId.repost.list._(postId, 1)
    );
    navigation.navigate(NAV_NAMES.RepostList as never, {
      postId
    } as never)
  };
  return gotoCollectionFeed
}

export function useGotoSignIn(){
  const navigation = useNavigation()
  const gotoSignIn = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.SignIn}],
      }),
    );
  }
  return gotoSignIn
}

export function useGotoCollectionEventList({nftCollection}){
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCollectionEventList = () => {
    apiGETWithToken(
      apis.collectionEvent.contractAddress.list(nftCollection.contract_address)
    )
    navigation.navigate(NAV_NAMES.CollectionEventList as never, {
      nftCollection
    } as never)
  }
  return gotoCollectionEventList
}

export function useGotoAttendanceList({collectionEventId}){
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoAttendanceList = (attendanceCategory) => {
    apiGETWithToken(
      apis.attendance.collectionEventId.list(
        collectionEventId,
        attendanceCategory,
      )
    )
    navigation.navigate(NAV_NAMES.AttendanceList as never, {
      collectionEventId,
        attendanceCategory,
    } as never)
  }
  return gotoAttendanceList
}

export function useGotoNewCollectionEvent({nftCollection}){
  const navigation = useNavigation()
  const gotoNewCollectionEvent = () => {
    navigation.navigate(NAV_NAMES.NewCollectionEvent as never, {
      nftCollection
    } as never)
  }
  return gotoNewCollectionEvent
}

export function useGotoAffinity({nftCollection}){
  const navigation = useNavigation()
  const gotoAffinity = () => {
    navigation.navigate(NAV_NAMES.Affinity as never, {
      nftCollection
    } as never)
  }
  return gotoAffinity
}


export function useGotoCollectionEvent({collectionEvent}){
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCollectionEvent = (reload=false) => {
    if(reload){
      apiGETWithToken(
        apis.collectionEvent.collectionEventId(
          collectionEvent.id
        )
      )
    }
    navigation.navigate(NAV_NAMES.CollectionEvent as never, {
      collectionEvent,
      reload
    } as never)
  }
  return gotoCollectionEvent
}