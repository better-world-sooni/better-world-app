import { CommonActions, useNavigation } from "@react-navigation/native";
import { shallowEqual, useSelector } from "react-redux";
import apis from "src/modules/apis";
import { NAV_NAMES } from "src/modules/navNames";
import { useApiGETWithToken, useApiPOSTWithToken, useApiGET, useReloadGETWithToken } from "src/redux/asyncReducer";
import { RootState } from "src/redux/rootReducer";
import { ChatRoomEnterType } from "src/screens/ChatRoomScreen";
import { FollowOwnerType, FollowType } from "src/screens/FollowListScreen";
import { ForumFeedFilter } from "src/screens/Home/HomeScreen";
import { PostType } from "src/screens/NewPostScreen";

export function useGotoNftProfile({nft}){
    const apiGETWithToken = useApiGETWithToken()
    const apiGET = useApiGET()
    const navigation = useNavigation()
    const gotoProfile = (notificationOpened=false, jwt=null) => {
      if(notificationOpened) {
        apiGET(
          apis.nft.contractAddressAndTokenId(
            nft.contract_address,
            nft.token_id,
          ),
          jwt
        );
        apiGET(
          apis.post.list.nft(nft.contract_address, nft.token_id),
          jwt
        );
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes:[{name: NAV_NAMES.Home},{name: NAV_NAMES.OtherProfile, params: {nft}}]
          })
        );
      }
      else {
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
        } as never);
      }
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

export function useGotoPasswordSignIn(){
  const navigation = useNavigation()
  const gotoPasswordSignIn = () => {
        navigation.navigate(NAV_NAMES.PasswordSignIn as never);
    }
    return gotoPasswordSignIn
}

export function useGotoChatList(){
  const navigation = useNavigation()
  const reloadGETWithToken = useReloadGETWithToken()
  const gotoChatList = () => {
    reloadGETWithToken(
      apis.chat.chatRoom.all()
    );
    navigation.navigate(NAV_NAMES.ChatList as never);
  }
  return gotoChatList
}

export function useGotoChatRoomFromList() {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoChatRoomFromList = (roomName, roomImage, roomId, inRoomSetIsEntered, inRoomUnreadCountUpdate, inRoomMessageUpdate) => {
    apiGETWithToken(
      apis.chat.chatRoom.roomId(roomId),
    );
    navigation.navigate(NAV_NAMES.ChatRoom as never, {
      roomName,
      roomImage,
      roomId,
      chatRoomEnterType: ChatRoomEnterType.List,
      inRoomSetIsEntered, 
      inRoomUnreadCountUpdate, 
      inRoomMessageUpdate
    } as never);
  };
  return gotoChatRoomFromList
}

export function useGotoChatRoomFromProfile() {
  const navigation = useNavigation()
  const apiPOSTWithToken = useApiPOSTWithToken()
  const gotoChatRoomFromProfile = (roomName, roomImage, contractAddress, tokenId)  => {
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
      chatRoomEnterType: ChatRoomEnterType.Profile
    } as never);
  }
  return gotoChatRoomFromProfile
}

export function useGotoNftCollectionProfile({nftCollection}){
    const apiGETWithToken = useApiGETWithToken()
    const navigation = useNavigation()
    const gotoProfile = () => {
      apiGETWithToken(apis.nft_collection.contractAddress._(nftCollection.contract_address));
      apiGETWithToken(apis.post.list.nftCollection(nftCollection.contract_address))
      navigation.navigate(NAV_NAMES.NftCollection as never, {
        nftCollection
      } as never);
    }
    return gotoProfile
}

export function useGotoPost({postId}){
  const apiGETWithToken = useApiGETWithToken()
  const apiGET = useApiGET()
  const navigation = useNavigation()
  const gotoPost = (autoFocus=false, notificationOpened=false, jwt=null) => {
    if(notificationOpened) {
      apiGET(apis.post.postId._(postId), jwt)
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes:[{name: NAV_NAMES.Home},{name: NAV_NAMES.Post, params: {postId, autoFocus}}]
        })
      );
    }
    else{
      apiGETWithToken(apis.post.postId._(postId));
      navigation.navigate(NAV_NAMES.Post as never, {postId, autoFocus} as never);
    }
  }
  return gotoPost
}

export function useGotoNewPost({postOwnerType}){
  const navigation = useNavigation()
  const gotoNewPost = (repostable = null, collectionEvent = null, transaction = null, postType=PostType.Default) => {
    navigation.navigate(NAV_NAMES.NewPost as never, {postOwnerType, repostable, collectionEvent, transaction, postType} as never);
  }
  return gotoNewPost
}

export function useGotoCollectionFeedTagSelect(){
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
);
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCollectionFeedTagSelect = (primaryKey, foreignKeyName) => {
    apiGETWithToken(apis.feed.forum(ForumFeedFilter.Resolved))
    navigation.navigate(NAV_NAMES.CollectionFeedTagSelect as never, {primaryKey, foreignKeyName} as never);
  }
  return gotoCollectionFeedTagSelect
}


export function useGotoNewCommunityWallet(){
  const navigation = useNavigation()
  const gotoNewCommunityWallet = () => {
    navigation.navigate(NAV_NAMES.NewCommunityWallet as never);
  }
  return gotoNewCommunityWallet
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

export function useGotoMyCommunityWalletList() {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCommunityWalletList = () => {
    apiGETWithToken(
      apis.nft_collection.communityWallet.list(),
    );
    navigation.navigate(NAV_NAMES.CommunityWalletList as never)
  };
  return gotoCommunityWalletList
}

export function useGotoCommunityWalletProfile({communityWallet}) {
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCommunityWalletProfile = () => {
    apiGETWithToken(
      apis.community_wallet.address._(
        communityWallet?.address
      ),
    );
    apiGETWithToken(
      apis.community_wallet.address.transaction.list(
        communityWallet?.address
      ),
    );
    navigation.navigate(NAV_NAMES.CommunityWalletProfile as never, {
      communityWallet
    } as never)
  };
  return gotoCommunityWalletProfile
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
  const apiGetWithToken = useApiGETWithToken()
  const gotoFollowList= (followType) => {
    apiGetWithToken(
      followOwnerType == FollowOwnerType.Nft
        ? apis.follow.list(
            followType == FollowType.Followers,
            contractAddress,
            tokenId,
          )
        : apis.follow.list(
            followType == FollowType.Followers,
            contractAddress,
            null
          )
    );
    navigation.navigate(NAV_NAMES.FollowList as never, {followOwnerType, followType, contractAddress, tokenId} as never)
  };
  return gotoFollowList
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
  const gotoQR = () => {
    apiPOSTWithToken(apis.auth.jwt.qr._(), {
      contract_address: currentNft.contract_address,
      token_id: currentNft.token_id
    })
    navigation.navigate(NAV_NAMES.Qr as never)
  }
  return gotoQR
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
        index: 1,
        routes: [{name: NAV_NAMES.SignIn}],
      }),
    );
  }
  return gotoSignIn
}

export function useGotoMyCollectionEventList(){
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCollectionEventList = () => {
    apiGETWithToken(
      apis.nft_collection.collectionEvent.list()
    )
    navigation.navigate(NAV_NAMES.CollectionEventList as never)
  }
  return gotoCollectionEventList
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

export function useGotoNewCollectionEvent(){
  const navigation = useNavigation()
  const gotoNewCollectionEvent = () => {
    navigation.navigate(NAV_NAMES.NewCollectionEvent as never)
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

export function useGotoCollectionSearch({contractAddress}){
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoCollectionEvent = () => {
    apiGETWithToken(
      apis.nft_collection.contractAddress.nft.list(contractAddress)
    )
    navigation.navigate(NAV_NAMES.CollectionSearch as never, {
      contractAddress
    } as never)
  }
  return gotoCollectionEvent
}

export function useGotoTransaction({transactionHash}){
  const navigation = useNavigation()
  const apiGETWithToken = useApiGETWithToken()
  const gotoTransaction = () => {
    apiGETWithToken(
      apis.blockchain_transaction._(transactionHash)
    )
    navigation.navigate(NAV_NAMES.Transaction as never, {
      transactionHash
    } as never)
  }
  return gotoTransaction
}