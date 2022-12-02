import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Img} from 'src/components/common/Img';
import BottomTabBar from 'src/components/BottomTabBar';
import {getNftProfileImage} from 'src/utils/nftUtils';
import {ICONS} from 'src/modules/icons';
import {Colors} from 'src/modules/styles';
import {Home, Send, User, ShoppingBag} from 'react-native-feather';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {NAV_NAMES} from 'src/modules/navNames';
import ProfileScreen from 'src/screens/Home/ProfileScreen';
import SplashScreen from 'src/screens/Common/SplashScreen';
import SignInScreen from 'src/screens/Auth/SignInScreen';
import ChatRoomScreen from 'src/screens/ChatRoomScreen';
import OnboardingScreen from 'src/screens/Auth/OnboardingScreen';
import PostScreen from 'src/screens/PostScreen';
import OtherProfileScreen from 'src/screens/OtherProfileScreen';
import NftCollectionScreen from 'src/screens/NftCollectionScreen';
import NewPostScreen from 'src/screens/NewPostScreen';
import ReportScreen from 'src/screens/ReportScreen';
import SearchScreen from 'src/screens/SearchScreen';
import ChatListScreen from 'src/screens/Home/ChatListScreen';
import LikeListScreen from 'src/screens/LikeListScreen';
import FollowListScreen from 'src/screens/FollowListScreen';
import VoteListScreen from 'src/screens/VoteListScreen';
import QrScreen from 'src/screens/QrScreen';
import ScanScreen from 'src/screens/ScanScreen';
import NotificationScreen from 'src/screens/NotificationScreen';
import CollectionFeedScreen from 'src/screens/CollectionFeedScreen';
import RepostListScreen from 'src/screens/RepostListScreen';
import CollectionEventListScreen from 'src/screens/CollectionEventListScreen';
import NewCollectionEventScreen from 'src/screens/NewCollectionEventScreen';
import AttendanceListScreen from 'src/screens/AttendanceListScreen';
import CollectionEventScreen from 'src/screens/CollectionEventScreen';
import PasswordSigninScreen from 'src/screens/Auth/PasswordSigninScreen';
import CollectionSearchScreen from 'src/screens/CollectionMemberSearchScreen';
import SocialScreen from 'src/screens/Home/SocialScreen';
import CommunityWalletListScreen from 'src/screens/CommunityWalletListScreen';
import CommunityWalletProfileScreen from 'src/screens/CommunityWalletProfileScreen';
import NewCommunityWalletScreen from 'src/screens/NewCommunityWalletScreen';
import CollectionFeedTagSelectScreen from 'src/screens/CollectionFeedTagSelectScreen';
import TransactionScreen from 'src/screens/TransactionScreen';
import StoreScreen from 'src/screens/Home/StoreScreen';
import {Platform} from 'react-native';
import ConfirmationModalScreen from 'src/screens/ConfirmationModalScreen';
import ForumSettingScreen from 'src/screens/ForumSettingScreen';
import SocialSettingScreen from 'src/screens/SocialSettingScreen';
import NftProfileEditScreen from 'src/screens/NftProfileEditScreen';
import NftCollectionProfileEditScreen from 'src/screens/NftCollectionProfileEditScreen';
import StoreSettingScreen from 'src/screens/StoreSettingScreen';
import EventApplicationListScreen from 'src/screens/EventApplicationListScreen';
import {ChatRoomEnterType} from 'src/screens/ChatRoomScreen';
import NftSettingScreen from 'src/screens/NftSettingScreen';
import NewDrawEventScreen from 'src/screens/NewDrawEventScreen';
import DrawEventScreen from 'src/screens/DrawEventScreen';
import CollectionEventApplicationListScreen from 'src/screens/CollectionEventApplicationListScreen';
import KlipSignInScreen from 'src/screens/Auth/KlipSignInScreen';
import KaikasSignInScreen from 'src/screens/Auth/KaikasSignInScreen';
import NewAnnouncementScreen from 'src/screens/NewAnnouncementScreen';
import CollectionMemberSearchScreen from 'src/screens/CollectionMemberSearchScreen';
import NftCollectionSearchScreen from 'src/screens/NftCollectionSearchScreen';
import DonationConfirmationScreen from 'src/screens/DonationConfirmationScreen';
import DonationListScreen from 'src/screens/DonationListScreen';
import {Div} from './common/Div';
import PickNftCollectionScreen from 'src/screens/Auth/PickNftCollectionScreen';
import UgcConfirmationScreen from 'src/screens/UgcConfirmationScreen';
import RepostDrawEventScreen from 'src/screens/RepostDrawEventListScreen';
import BookmarkedDrawEventListScreen from 'src/screens/BookmarkedDrawEventListScreen';

const RootStack = createStackNavigator();

const Tab = createBottomTabNavigator();
const tabBarFunc = props => <BottomTabBar {...props} />;

const MainBottomTabs = () => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );

  const profileTabIconBackgroundProps = {
    w: 28,
    h: 28,
    rounded: 100,
  };
  const profileTabIconProps = {
    uri: getNftProfileImage(currentNft, 50, 50),
    absolute: true,
    top: 2,
    left: 2,
    w: 24,
    h: 24,
    rounded: 100,
  };
  return (
    <Tab.Navigator
      tabBar={tabBarFunc}
      initialRouteName={NAV_NAMES.Social}
      screenOptions={{
        lazy: false,
        headerShown: false,
      }}>
      <Tab.Screen
        name={NAV_NAMES.Store}
        component={StoreScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Img
              w={22}
              h={24}
              source={ICONS.drawEvent}
              opacity={focused ? 1 : 0.6}></Img>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Home + 'bottom'}
        component={SocialScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Home
              width={22}
              height={22}
              strokeWidth={2}
              color={focused ? Colors.black : Colors.gray.DEFAULT}></Home>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.ChatList}
        component={ChatListScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Send
              width={22}
              height={22}
              strokeWidth={2}
              color={focused ? Colors.black : Colors.gray.DEFAULT}></Send>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: NAV_NAMES.Social,
          tabBarIcon: ({focused}) =>
            currentNft ? (
              <Div {...profileTabIconBackgroundProps}>
                {focused && (
                  <Img
                    {...profileTabIconBackgroundProps}
                    source={ICONS.primaryCircle}></Img>
                )}
                <Img {...profileTabIconProps}></Img>
              </Div>
            ) : (
              <Div>
                <User
                  width={22}
                  height={22}
                  strokeWidth={2}
                  color={
                    focused ? Colors.primary.DEFAULT : Colors.gray.DEFAULT
                  }></User>
              </Div>
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const setInitialRouteParams = notificationOpenData => {
  if (notificationOpenData) {
    if (
      ['like_post', 'like_comment', 'comment', 'vote', 'donation'].includes(
        notificationOpenData.event,
      )
    ) {
      return {
        notificationOpened: true,
        routeDestination: {
          navName: NAV_NAMES.Post,
          id: {
            postId: notificationOpenData.post_id,
          },
        },
      };
    } else if (['follow', 'hug'].includes(notificationOpenData.event)) {
      return {
        notificationOpened: true,
        routeDestination: {
          navName: NAV_NAMES.OtherProfile,
          id: {
            contract_address: notificationOpenData.contract_address,
            token_id: notificationOpenData.token_id,
            name: notificationOpenData?.name,
            image_uri: notificationOpenData?.image_uri,
            nft_metadatum: {
              name: notificationOpenData.meta_name,
              image_uri: notificationOpenData.meta_image_uri,
            },
          },
        },
      };
    } else if (notificationOpenData.event === 'chat') {
      return {
        notificationOpened: true,
        routeDestination: {
          navName: NAV_NAMES.ChatRoom,
          id: {
            roomId: notificationOpenData.room_id,
            roomName:
              notificationOpenData?.name || notificationOpenData.meta_name,
            roomImage:
              notificationOpenData?.image_uri ||
              notificationOpenData.meta_image_uri,
            opponentNft: {
              contract_address: notificationOpenData.contract_address,
              token_id: notificationOpenData.token_id,
            },
            chatRoomEnterType: ChatRoomEnterType.Notification,
          },
        },
      };
    }
  } else {
    return {
      notificationOpened: false,
    };
  }
};

export const AppContent = ({notificationOpenData}) => {
  const initialRouteParams = setInitialRouteParams(notificationOpenData);

  const Navs = [
    {
      name: NAV_NAMES.Splash,
      component: SplashScreen,
      initialParams: initialRouteParams,
    },
    {
      name: NAV_NAMES.SignIn,
      component: SignInScreen,
      options: props => ({
        gestureEnabled: false,
      }),
    } as any,
    {
      name: NAV_NAMES.PasswordSignIn,
      component: PasswordSigninScreen,
    },
    {
      name: NAV_NAMES.Home,
      component: MainBottomTabs,
      options: props => ({
        gestureEnabled: false,
        cardStyle: {backgroundColor: Colors.white, presentation: 'screen'},
        headershown: false,
      }),
    },
    {
      name: NAV_NAMES.Profile,
      component: ProfileScreen,
    },
    {
      name: NAV_NAMES.OtherProfile,
      component: OtherProfileScreen,
    },
    {
      name: NAV_NAMES.NftCollection,
      component: NftCollectionScreen,
    },
    {
      name: NAV_NAMES.CollectionFeed,
      component: CollectionFeedScreen,
    },
    {
      name: NAV_NAMES.Post,
      component: PostScreen,
    },
    {
      name: NAV_NAMES.Report,
      component: ReportScreen,
    },
    {
      name: NAV_NAMES.NewPost,
      component: NewPostScreen,
    },
    {
      name: NAV_NAMES.LikeList,
      component: LikeListScreen,
    },
    {
      name: NAV_NAMES.FollowList,
      component: FollowListScreen,
    },
    {
      name: NAV_NAMES.VoteList,
      component: VoteListScreen,
    },
    {
      name: NAV_NAMES.Onboarding,
      component: OnboardingScreen,
    },
    {
      name: NAV_NAMES.Scan,
      component: ScanScreen,
      options:
        Platform.OS == 'ios'
          ? TransitionPresets.ModalSlideFromBottomIOS
          : TransitionPresets.ModalTransition,
    },
    {
      name: NAV_NAMES.Notification,
      component: NotificationScreen,
    },
    {
      name: NAV_NAMES.RepostList,
      component: RepostListScreen,
    },
    {
      name: NAV_NAMES.RepostDrawEventList,
      component: RepostDrawEventScreen,
    },
    {
      name: NAV_NAMES.CollectionEventList,
      component: CollectionEventListScreen,
    },
    {
      name: NAV_NAMES.NewCollectionEvent,
      component: NewCollectionEventScreen,
    },
    {
      name: NAV_NAMES.AttendanceList,
      component: AttendanceListScreen,
    },
    {
      name: NAV_NAMES.CollectionEvent,
      component: CollectionEventScreen,
      options: TransitionPresets.ModalTransition,
    },
    {
      name: NAV_NAMES.Qr,
      component: QrScreen,
      options:
        Platform.OS == 'ios'
          ? TransitionPresets.ModalSlideFromBottomIOS
          : TransitionPresets.ModalTransition,
    },
    {
      name: NAV_NAMES.Search,
      component: SearchScreen,
    },
    {
      name: NAV_NAMES.ChatRoom,
      component: ChatRoomScreen,
    },
    {
      name: NAV_NAMES.ChatList,
      component: ChatListScreen,
    },
    {
      name: NAV_NAMES.CollectionMemberSearch,
      component: CollectionMemberSearchScreen,
    },
    {
      name: NAV_NAMES.CommunityWalletProfile,
      component: CommunityWalletProfileScreen,
    },
    {
      name: NAV_NAMES.CommunityWalletList,
      component: CommunityWalletListScreen,
    },
    {
      name: NAV_NAMES.NewCommunityWallet,
      component: NewCommunityWalletScreen,
    },
    {
      name: NAV_NAMES.ConfirmationModal,
      component: ConfirmationModalScreen,
      options: {
        presentation: 'transparentModal',
      },
    },
    {
      name: NAV_NAMES.CollectionFeedTagSelect,
      component: CollectionFeedTagSelectScreen,
      options:
        Platform.OS == 'ios'
          ? TransitionPresets.ModalSlideFromBottomIOS
          : TransitionPresets.ModalTransition,
    },
    {
      name: NAV_NAMES.ForumSetting,
      component: ForumSettingScreen,
      options: TransitionPresets.ModalTransition,
    },
    {
      name: NAV_NAMES.SocialSetting,
      component: SocialSettingScreen,
      options: TransitionPresets.ModalTransition,
    },
    {
      name: NAV_NAMES.NftProfileEdit,
      component: NftProfileEditScreen,
      options: TransitionPresets.ModalTransition,
    },
    {
      name: NAV_NAMES.NftCollectionProfileEdit,
      component: NftCollectionProfileEditScreen,
      options: TransitionPresets.ModalTransition,
    },
    {
      name: NAV_NAMES.Transaction,
      component: TransactionScreen,
    },
    {
      name: NAV_NAMES.Store,
      component: StoreScreen,
    },
    {
      name: NAV_NAMES.StoreSetting,
      component: StoreSettingScreen,
    },
    {
      name: NAV_NAMES.NewDrawEvent,
      component: NewDrawEventScreen,
    },
    {
      name: NAV_NAMES.EventApplicationList,
      component: EventApplicationListScreen,
    },
    {
      name: NAV_NAMES.BookmarkedDrawEventList,
      component: BookmarkedDrawEventListScreen,
    },
    {
      name: NAV_NAMES.NftSetting,
      component: NftSettingScreen,
    },
    {
      name: NAV_NAMES.DrawEvent,
      component: DrawEventScreen,
    },
    {
      name: NAV_NAMES.CollectionEventApplicationList,
      component: CollectionEventApplicationListScreen,
    },
    {
      name: NAV_NAMES.KlipSignIn,
      component: KlipSignInScreen,
    },
    {
      name: NAV_NAMES.KaikasSignIn,
      component: KaikasSignInScreen,
    },
    {
      name: NAV_NAMES.NewAnnouncement,
      component: NewAnnouncementScreen,
    },
    {
      name: NAV_NAMES.NftCollectionSearch,
      component: NftCollectionSearchScreen,
    },
    {
      name: NAV_NAMES.DonationList,
      component: DonationListScreen,
    },
    {
      name: NAV_NAMES.DonationConfirmation,
      component: DonationConfirmationScreen,
      options: {
        presentation: 'transparentModal',
      },
    },
    {
      name: NAV_NAMES.UgcConfirmation,
      component: UgcConfirmationScreen,
      options: {
        presentation: 'transparentModal',
      },
    },
    {
      name: NAV_NAMES.PickNftCollection,
      component: PickNftCollectionScreen,
    },
  ];

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {Navs.map((item, i) => (
        <RootStack.Screen
          key={i}
          name={item.name}
          component={item.component}
          options={item.options}
          initialParams={item.initialParams}
        />
      ))}
    </RootStack.Navigator>
  );
};
