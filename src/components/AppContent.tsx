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
import HomeScreen from 'src/screens/Home/HomeScreen';
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
import CollectionSearchScreen from 'src/screens/CollectionSearchScreen';
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
import NewMerchandiseScreen from 'src/screens/NewMerchandiseScreen';
import MerchandiseScreen from 'src/screens/MerchandiseScreen';
import NewCouponScreen from 'src/screens/NewCouponScreen';
import MerchandiseSelectScreen from 'src/screens/MerchandiseSelectScreen';
import OrderListScreen from 'src/screens/OrderListScreen';
import CouponListScreen from 'src/screens/CouponListScreen';
import CollectionOrderListScreen from 'src/screens/CollectionOrderListScreen';

const RootStack = createStackNavigator();

const Tab = createBottomTabNavigator();
const tabBarFunc = props => <BottomTabBar {...props} />;

const MainBottomTabs = () => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );

  const profileTabIconProps = {
    uri: getNftProfileImage(currentNft, 50, 50),
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
        name={NAV_NAMES.Social}
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
        name={NAV_NAMES.Home + 'bottom'}
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <Img source={ICONS.lightBulb} h22 w22></Img>
            ) : (
              <Img source={ICONS.lightBulbGray} h22 w22></Img>
            ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Store}
        component={StoreScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <ShoppingBag
              width={22}
              height={22}
              strokeWidth={2}
              color={
                focused ? Colors.black : Colors.gray.DEFAULT
              }></ShoppingBag>
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
              <Img
                {...profileTabIconProps}
                border2={focused}
                borderBlack={focused}></Img>
            ) : (
              <User
                width={22}
                height={22}
                strokeWidth={2}
                color={focused ? Colors.black : Colors.gray.DEFAULT}></User>
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const setInitialRouteParams = notificationOpenData => {
  if (notificationOpenData) {
    if (
      ['like_post', 'like_comment', 'comment', 'vote'].includes(
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
      name: NAV_NAMES.CollectionSearch,
      component: CollectionSearchScreen,
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
      name: NAV_NAMES.MerchandiseSelect,
      component: MerchandiseSelectScreen,
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
      name: NAV_NAMES.NewMerchandise,
      component: NewMerchandiseScreen,
    },
    {
      name: NAV_NAMES.Merchandise,
      component: MerchandiseScreen,
    },
    {
      name: NAV_NAMES.NewCoupon,
      component: NewCouponScreen,
    },
    {
      name: NAV_NAMES.OrderList,
      component: OrderListScreen,
    },
    {
      name: NAV_NAMES.CouponList,
      component: CouponListScreen,
    },
    {
      name: NAV_NAMES.CollectionOrderList,
      component: CollectionOrderListScreen,
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
