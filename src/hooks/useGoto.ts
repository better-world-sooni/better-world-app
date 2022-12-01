import {CommonActions, useNavigation} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import apis from 'src/modules/apis';
import {NAV_NAMES} from 'src/modules/navNames';
import {appActions} from 'src/redux/appReducer';
import {
  useApiGETWithToken,
  useApiPOSTWithToken,
  useApiGET,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {ChatRoomEnterType} from 'src/screens/ChatRoomScreen';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {PostType} from 'src/screens/NewPostScreen';
import {EventApplicationFilter} from 'src/screens/EventApplicationListScreen';
enum ForumFeedFilter {
  All = 'all',
  Following = 'following',
  Approved = 'approved',
}

export function useGotoNftProfile({nft}) {
  const apiGETWithToken = useApiGETWithToken();
  const apiGET = useApiGET();
  const navigation = useNavigation();
  const gotoProfile = (notificationOpened = false, jwt = null) => {
    if (notificationOpened) {
      apiGET(
        apis.nft.contractAddressAndTokenId(nft.contract_address, nft.token_id),
        jwt,
      );
      apiGET(apis.post.list.nft(nft.contract_address, nft.token_id), jwt);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: NAV_NAMES.Home},
            {name: NAV_NAMES.OtherProfile, params: {nft}},
          ],
        }),
      );
    } else {
      apiGETWithToken(
        apis.nft.contractAddressAndTokenId(nft.contract_address, nft.token_id),
      );
      apiGETWithToken(apis.post.list.nft(nft.contract_address, nft.token_id));
      navigation.navigate(
        NAV_NAMES.OtherProfile as never,
        {
          nft,
        } as never,
      );
    }
  };
  return gotoProfile;
}

export function useGotoProfile() {
  const navigation = useNavigation();
  const gotoProfile = () => {
    navigation.navigate(NAV_NAMES.Profile as never);
  };
  return gotoProfile;
}

export function useGotoPasswordSignIn() {
  const navigation = useNavigation();
  const gotoPasswordSignIn = () => {
    navigation.navigate(NAV_NAMES.PasswordSignIn as never);
  };
  return gotoPasswordSignIn;
}

export function useGotoChatList() {
  const navigation = useNavigation();
  const reloadGETWithToken = useReloadGETWithToken();
  const gotoChatList = () => {
    reloadGETWithToken(apis.chat.chatRoom.all());
    navigation.navigate(NAV_NAMES.ChatList as never);
  };
  return gotoChatList;
}

export function useGotoChatRoomFromList() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoChatRoomFromList = (roomId, roomName, roomImage, opponentNft) => {
    apiGETWithToken(apis.chat.chatRoom.roomId(roomId));
    navigation.navigate(
      NAV_NAMES.ChatRoom as never,
      {
        roomId,
        roomName,
        roomImage,
        opponentNft,
        chatRoomEnterType: ChatRoomEnterType.List,
      } as never,
    );
  };
  return gotoChatRoomFromList;
}

export function useGotoChatRoomFromProfile() {
  const navigation = useNavigation();
  const apiPOSTWithToken = useApiPOSTWithToken();
  const gotoChatRoomFromProfile = (
    roomName,
    roomImage,
    contractAddress,
    tokenId,
  ) => {
    apiPOSTWithToken(
      apis.chat.chatRoom.contractAddressAndTokenId(contractAddress, tokenId),
    );
    navigation.navigate(
      NAV_NAMES.ChatRoom as never,
      {
        roomName,
        roomImage,
        opponentNft: {
          contract_address: contractAddress,
          token_id: tokenId,
        },
        chatRoomEnterType: ChatRoomEnterType.Profile,
      } as never,
    );
  };
  return gotoChatRoomFromProfile;
}

export function useGotoChatRoomFromNotification(routeParams) {
  const navigation = useNavigation();
  const apiGET = useApiGET();
  const gotoChatRoomFromNotification = jwt => {
    apiGET(apis.chat.chatRoom.roomId(routeParams.roomId), jwt);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: NAV_NAMES.Home, params: {screen: NAV_NAMES.ChatList}},
          {name: NAV_NAMES.ChatRoom, params: routeParams},
        ],
      }),
    );
  };
  return gotoChatRoomFromNotification;
}

export function useGotoNftCollectionProfile({nftCollection}) {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const apiGETWithToken = useApiGETWithToken();
  const navigation = useNavigation();
  const gotoProfile = () => {
    apiGETWithToken(
      currentNft.contract_address == nftCollection.contract_address
        ? apis.nft_collection._()
        : apis.nft_collection.contractAddress._(nftCollection.contract_address),
    );
    apiGETWithToken(
      apis.feed.draw_event.nftCollection(nftCollection.contract_address),
    );

    navigation.navigate(
      NAV_NAMES.NftCollection as never,
      {
        nftCollection,
      } as never,
    );
  };
  return gotoProfile;
}

export function useGotoPost({postId}) {
  const apiGETWithToken = useApiGETWithToken();
  const apiGET = useApiGET();
  const navigation = useNavigation();
  const gotoPost = (
    autoFocus = false,
    notificationOpened = false,
    jwt = null,
    onlyComments = false,
  ) => {
    if (notificationOpened) {
      apiGET(apis.post.postId._(postId), jwt);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: NAV_NAMES.Home},
            {name: NAV_NAMES.Post, params: {postId, autoFocus}},
          ],
        }),
      );
    } else {
      apiGETWithToken(apis.post.postId._(postId));
      navigation.navigate(
        NAV_NAMES.Post as never,
        {postId, autoFocus, onlyComments} as never,
      );
    }
  };
  return gotoPost;
}

export function useGotoNewPost({postOwnerType}) {
  const navigation = useNavigation();
  const gotoNewPost = ({
    repostable = null,
    repostDrawEvent = null,
    collectionEvent = null,
    transaction = null,
    postType = PostType.Default,
  }) => {
    navigation.navigate(
      NAV_NAMES.NewPost as never,
      {
        postOwnerType,
        repostable,
        collectionEvent,
        transaction,
        postType,
        repostDrawEvent,
      } as never,
    );
  };
  return gotoNewPost;
}

export function useGotoCollectionFeedTagSelect() {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionFeedTagSelect = (primaryKey, foreignKeyName) => {
    apiGETWithToken(apis.feed.forum(ForumFeedFilter.Approved));
    navigation.navigate(
      NAV_NAMES.CollectionFeedTagSelect as never,
      {primaryKey, foreignKeyName} as never,
    );
  };
  return gotoCollectionFeedTagSelect;
}

export function useGotoNewCommunityWallet() {
  const navigation = useNavigation();
  const gotoNewCommunityWallet = () => {
    navigation.navigate(NAV_NAMES.NewCommunityWallet as never);
  };
  return gotoNewCommunityWallet;
}

export function useGotoLikeList({likableType, likableId}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCapsule = () => {
    apiGETWithToken(apis.like.list(likableType, likableId));
    navigation.navigate(
      NAV_NAMES.LikeList as never,
      {
        likableType,
        likableId,
      } as never,
    );
  };
  return gotoCapsule;
}

export function useGotoDonationList({postId}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoDonationList = () => {
    apiGETWithToken(apis.donation.postId.list(postId));
    navigation.navigate(
      NAV_NAMES.DonationList as never,
      {
        postId,
      } as never,
    );
  };
  return gotoDonationList;
}

export function useGotoUgcConfirmation() {
  const navigation = useNavigation();
  const gotoUgcConfirmation = ({onConfirm}) => {
    navigation.navigate(
      NAV_NAMES.UgcConfirmation as never,
      {
        onConfirm,
      } as never,
    );
  };
  return gotoUgcConfirmation;
}

export function useGotoForumSetting() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoForumSetting = () => {
    apiGETWithToken(apis.forum_setting._());
    navigation.navigate(NAV_NAMES.ForumSetting as never);
  };
  return gotoForumSetting;
}

export function useGotoSocialSetting() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoSocialSetting = () => {
    apiGETWithToken(apis.social_setting._());
    navigation.navigate(NAV_NAMES.SocialSetting as never);
  };
  return gotoSocialSetting;
}

export function useGotoNftProfileEdit() {
  const navigation = useNavigation();
  const gotoNftProfileEdit = () => {
    navigation.navigate(NAV_NAMES.NftProfileEdit as never);
  };
  return gotoNftProfileEdit;
}
export function useGotoNftSetting() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoNftSetting = () => {
    apiGETWithToken(apis.pushNotificationSetting._());
    navigation.navigate(NAV_NAMES.NftSetting as never);
  };
  return gotoNftSetting;
}

export function useGotoNftCollectionProfileEdit() {
  const navigation = useNavigation();
  const gotoNftProfileEdit = () => {
    navigation.navigate(NAV_NAMES.NftCollectionProfileEdit as never);
  };
  return gotoNftProfileEdit;
}

export function useGotoMyCommunityWalletList() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCommunityWalletList = () => {
    apiGETWithToken(apis.nft_collection.communityWallet.list());
    navigation.navigate(NAV_NAMES.CommunityWalletList as never);
  };
  return gotoCommunityWalletList;
}

export function useGotoCommunityWalletProfile({communityWallet}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCommunityWalletProfile = () => {
    apiGETWithToken(apis.community_wallet.address._(communityWallet?.address));
    apiGETWithToken(
      apis.community_wallet.address.transaction.list(communityWallet?.address),
    );
    navigation.navigate(
      NAV_NAMES.CommunityWalletProfile as never,
      {
        communityWallet,
      } as never,
    );
  };
  return gotoCommunityWalletProfile;
}

export function useGotoVoteList({postId}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const useGotoVoteList = voteCategory => {
    apiGETWithToken(apis.vote.list(voteCategory, postId));
    navigation.navigate(
      NAV_NAMES.VoteList as never,
      {
        voteCategory,
        postId,
      } as never,
    );
  };
  return useGotoVoteList;
}

export function useGotoFollowList({
  followOwnerType,
  contractAddress,
  tokenId = null,
}) {
  const navigation = useNavigation();
  const apiGetWithToken = useApiGETWithToken();
  const gotoFollowList = followType => {
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
            null,
          ),
    );
    navigation.navigate(
      NAV_NAMES.FollowList as never,
      {followOwnerType, followType, contractAddress, tokenId} as never,
    );
  };
  return gotoFollowList;
}

export function useGotoReport({id, reportType}) {
  const navigation = useNavigation();
  const gotoReport = () => {
    navigation.navigate(
      NAV_NAMES.Report as never,
      {
        id,
        reportType,
      } as never,
    );
  };
  return gotoReport;
}

export function useGotoQR() {
  const navigation = useNavigation();
  const apiPOSTWithToken = useApiPOSTWithToken();
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const gotoQR = () => {
    apiPOSTWithToken(apis.auth.jwt.qr._(), {
      contract_address: currentNft.contract_address,
      token_id: currentNft.token_id,
    });
    navigation.navigate(NAV_NAMES.Qr as never);
  };
  return gotoQR;
}

export function useGotoScan({scanType}) {
  const navigation = useNavigation();
  const gotoScan = () => {
    navigation.navigate(NAV_NAMES.Scan as never, {scanType} as never);
  };
  return gotoScan;
}

export function useGotoNotification() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const dispatch = useDispatch();
  const useGotoNotification = () => {
    apiGETWithToken(apis.notification.list._());
    dispatch(appActions.updateUnreadNotificationCount(0));
    navigation.navigate(NAV_NAMES.Notification as never);
  };
  return useGotoNotification;
}

export function useGotoHome() {
  const navigation = useNavigation();
  const gotoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.Home}],
      }),
    );
  };
  return gotoHome;
}

export function useGotoSearch() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoSearch = () => {
    apiGETWithToken(apis.rank.list());
    navigation.navigate(NAV_NAMES.Search as never);
  };
  return gotoSearch;
}

export function useGotoStoreSetting() {
  const navigation = useNavigation();
  const gotoStoreSetting = () => {
    navigation.navigate(NAV_NAMES.StoreSetting as never);
  };
  return gotoStoreSetting;
}

export function useGotoNewDrawEvent() {
  const navigation = useNavigation();

  const gotoNewDrawEvent = () => {
    navigation.navigate(NAV_NAMES.NewDrawEvent as never);
  };
  return gotoNewDrawEvent;
}

export function useGotoDrawEvent({
  drawEventId,
  image_uri = null,
  hasApplication = false,
  onlyComments = false,
}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoDrawEvent = (autoFocus = false) => {
    apiGETWithToken(apis.draw_event.drawEventId._(drawEventId));
    navigation.navigate(
      NAV_NAMES.DrawEvent as never,
      {image_uri: image_uri, hasApplication, onlyComments, autoFocus} as never,
    );
  };
  return gotoDrawEvent;
}

export function useGotoOnboarding() {
  const navigation = useNavigation();
  const gotoOnboarding = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: NAV_NAMES.Onboarding}],
      }),
    );
  };
  return gotoOnboarding;
}

export function useGotoNewAnnouncement() {
  const navigation = useNavigation();
  const gotoNewAnnouncement = () => {
    navigation.navigate(NAV_NAMES.NewAnnouncement as never);
  };
  return gotoNewAnnouncement;
}

export function useGotoKlipSignIn() {
  const navigation = useNavigation();
  const gotoKlipSignIn = () => {
    navigation.navigate(NAV_NAMES.KlipSignIn as never);
  };
  return gotoKlipSignIn;
}

export function useGotoKaikasSignIn() {
  const navigation = useNavigation();
  const gotoKlipSignIn = () => {
    navigation.navigate(NAV_NAMES.KaikasSignIn as never);
  };
  return gotoKlipSignIn;
}

export function useGotoConfirmationModal() {
  const navigation = useNavigation();
  const gotoConfirmation = ({onCancel = null, onConfirm = null, text}) => {
    navigation.navigate(
      NAV_NAMES.ConfirmationModal as never,
      {onCancel, onConfirm, text} as never,
    );
  };
  return gotoConfirmation;
}

export function useGotoDonationConfirmation() {
  const navigation = useNavigation();
  const gotoDonationConfirmation = ({onConfirm = null, nft, postId}) => {
    navigation.navigate(
      NAV_NAMES.DonationConfirmation as never,
      {onConfirm, nft, postId} as never,
    );
  };
  return gotoDonationConfirmation;
}

export function useGotoCollectionFeed({contractAddress}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionFeed = (title, type?) => {
    apiGETWithToken(apis.feed.collection(contractAddress, type));
    navigation.navigate(
      NAV_NAMES.CollectionFeed as never,
      {
        contractAddress,
        title,
        type,
      } as never,
    );
  };
  return gotoCollectionFeed;
}

export function useGotoRepostList({postId}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionFeed = title => {
    apiGETWithToken(apis.post.postId.repost.list._(postId, 1));
    navigation.navigate(
      NAV_NAMES.RepostList as never,
      {
        postId,
      } as never,
    );
  };
  return gotoCollectionFeed;
}

export function useGotoRepostDrawEventList({eventId}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionFeed = title => {
    apiGETWithToken(apis.draw_event.drawEventId.repost.list(eventId, 1));
    navigation.navigate(
      NAV_NAMES.RepostDrawEventList as never,
      {
        eventId,
      } as never,
    );
  };
  return gotoCollectionFeed;
}

export function useGotoSignIn() {
  const navigation = useNavigation();
  const gotoSignIn = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: NAV_NAMES.SignIn}],
      }),
    );
  };
  return gotoSignIn;
}

export function useGotoMyCollectionEventList() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionEventList = () => {
    apiGETWithToken(apis.nft_collection.collectionEvent.list());
    navigation.navigate(NAV_NAMES.CollectionEventList as never);
  };
  return gotoCollectionEventList;
}

export function useGotoEventApplicationList() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoEventApplicationList = () => {
    apiGETWithToken(
      apis.nft.eventApplication.list(EventApplicationFilter.APPLIED),
    );
    navigation.navigate(NAV_NAMES.EventApplicationList as never);
  };
  return gotoEventApplicationList;
}

export function useGotoCollectionEventApplicationList() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionEventApplicationList = () => {
    apiGETWithToken(apis.nft_collection.eventApplication.list());
    navigation.navigate(NAV_NAMES.CollectionEventApplicationList as never);
  };
  return gotoCollectionEventApplicationList;
}

export function useGotoCollectionEventList({nftCollection}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionEventList = () => {
    apiGETWithToken(
      apis.collectionEvent.contractAddress.list(nftCollection.contract_address),
    );
    navigation.navigate(
      NAV_NAMES.CollectionEventList as never,
      {
        nftCollection,
      } as never,
    );
  };
  return gotoCollectionEventList;
}

export function useGotoAttendanceList({collectionEventId}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoAttendanceList = attendanceCategory => {
    apiGETWithToken(
      apis.attendance.collectionEventId.list(
        collectionEventId,
        attendanceCategory,
      ),
    );
    navigation.navigate(
      NAV_NAMES.AttendanceList as never,
      {
        collectionEventId,
        attendanceCategory,
      } as never,
    );
  };
  return gotoAttendanceList;
}

export function useGotoNewCollectionEvent() {
  const navigation = useNavigation();
  const gotoNewCollectionEvent = () => {
    navigation.navigate(NAV_NAMES.NewCollectionEvent as never);
  };
  return gotoNewCollectionEvent;
}

export function useGotoAffinity({nftCollection}) {
  const navigation = useNavigation();
  const gotoAffinity = () => {
    navigation.navigate(
      NAV_NAMES.Affinity as never,
      {
        nftCollection,
      } as never,
    );
  };
  return gotoAffinity;
}

export function useGotoCollectionEvent({collectionEvent}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionEvent = (reload = false) => {
    if (reload) {
      apiGETWithToken(
        apis.collectionEvent.collectionEventId(collectionEvent.id),
      );
    }
    navigation.navigate(
      NAV_NAMES.CollectionEvent as never,
      {
        collectionEvent,
        reload,
      } as never,
    );
  };
  return gotoCollectionEvent;
}

export function useGotoCollectionMemberSearch({contractAddress}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoCollectionMemberSearch = () => {
    apiGETWithToken(
      apis.nft_collection.contractAddress.nft.list(contractAddress),
    );
    navigation.navigate(
      NAV_NAMES.CollectionMemberSearch as never,
      {
        contractAddress,
      } as never,
    );
  };
  return gotoCollectionMemberSearch;
}

export function useGotoNftCollectionSearch() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoNftCollectionSearch = () => {
    apiGETWithToken(apis.nft_collection.list());
    navigation.navigate(NAV_NAMES.NftCollectionSearch as never);
  };
  return gotoNftCollectionSearch;
}

export function useGotoPickNftCollection() {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const apiGET = useApiGET();
  const gotoPickNftCollection = (token?) => {
    token
      ? apiGET(apis.nft_collection.list(), token)
      : apiGETWithToken(apis.nft_collection.list());
    navigation.navigate(NAV_NAMES.PickNftCollection as never);
  };
  return gotoPickNftCollection;
}

export function useGotoTransaction({transactionHash}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const gotoTransaction = () => {
    apiGETWithToken(apis.blockchain_transaction._(transactionHash));
    navigation.navigate(
      NAV_NAMES.Transaction as never,
      {
        transactionHash,
      } as never,
    );
  };
  return gotoTransaction;
}
