import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import BottomTabBar from 'src/components/BottomTabBar';
import {NAV_NAMES} from 'src/modules/navNames';
import HomeScreen from 'src/screens/Home/HomeScreen';
import ProfileScreen from 'src/screens/Home/ProfileScreen';
import SplashScreen from 'src/screens/Common/SplashScreen';
import SignInScreen from 'src/screens/Auth/SignInScreen';
import PostScreen from 'src/screens/PostScreen';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import ChatRoomScreen from 'src/screens/ChatRoomScreen';
import OnboardingScreen from 'src/screens/Auth/OnboardingScreen';
import {Img} from './common/Img';
import {getNftProfileImage} from 'src/modules/nftUtils';
import {Home, Search, User} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import OtherProfileScreen from 'src/screens/OtherProfileScreen';
import NftCollectionScreen from 'src/screens/NftCollectionScreen';
import NewPostScreen from 'src/screens/NewPostScreen';
import ReportScreen from 'src/screens/ReportScreen';
import SearchScreen from 'src/screens/Home/SearchScreen';
import ChatListScreen from 'src/screens/ChatListScreen';
import LikeListScreen from 'src/screens/LikeListScreen';
import FollowListScreen from 'src/screens/FollowListScreen';
import VoteListScreen from 'src/screens/VoteListScreen';
import QrScreen from 'src/screens/QrScreen';
import ScanScreen from 'src/screens/ScanScreen';
import NotificationScreen from 'src/screens/NotificationScreen';
import RankDeltumScreen from 'src/screens/RankDeltumScreen';
import CollectionFeedScreen from 'src/screens/CollectionFeedScreen';
import ForumFeedScreen from 'src/screens/ForumFeedScreen';
import RepostListScreen from 'src/screens/RepostListScreen';
import CollectionEventListScreen from 'src/screens/CollectionEventListScreen';
import NewCollectionEventScreen from 'src/screens/NewCollectionEventScreen';
import AttendanceListScreen from 'src/screens/AttendanceListScreen';
import CollectionEventScreen from 'src/screens/CollectionEventScreen';
import AffinityScreen from 'src/screens/AffinityScreen';
import PasswordSigninScreen from 'src/screens/Auth/PasswordSigninScreen';
import {createStackNavigator} from '@react-navigation/stack';
import CollectionSearchScreen from 'src/screens/CollectionSearchScreen';
import SocialScreen from 'src/screens/Home/SocialScreen';
import TransactionListScreen from 'src/screens/CommunityWalletProfileScreen';
import CommunityWalletListScreen from 'src/screens/CommunityWalletListScreen';
import CommunityWalletProfile from './common/CommunityWalletProfile';
import CommunityWalletProfileScreen from 'src/screens/CommunityWalletProfileScreen';

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
      initialRouteName={NAV_NAMES.Home + 'bottom'}
      lazy={false}>
      <Tab.Screen
        name={NAV_NAMES.Home + 'bottom'}
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Home
              width={22}
              height={22}
              strokeWidth={2}
              color={focused ? 'black' : Colors.gray[400]}></Home>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Search}
        component={SearchScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Search
              width={22}
              height={22}
              strokeWidth={2}
              color={focused ? 'black' : Colors.gray[400]}></Search>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Social}
        component={SocialScreen}
        options={{
          tabBarLabel: NAV_NAMES.Social,
          tabBarIcon: ({focused}) =>
            currentNft ? (
              <Img
                {...profileTabIconProps}
                border1={focused}
                borderBlack={focused}></Img>
            ) : (
              <User
                width={22}
                height={22}
                strokeWidth={2}
                color={focused ? 'black' : Colors.gray[400]}></User>
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const setInitialRouteParams = notificationOpenData => {
  if (notificationOpenData) {
    if (
      ['like_post', 'like_comment', 'comment'].includes(
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
        cardStyle: {backgroundColor: 'white', presentation: 'screen'},
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
    },
    {
      name: NAV_NAMES.Notification,
      component: NotificationScreen,
    },
    {
      name: NAV_NAMES.RankDeltum,
      component: RankDeltumScreen,
    },
    {
      name: NAV_NAMES.ForumFeed,
      component: ForumFeedScreen,
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
      name: NAV_NAMES.Affinity,
      component: AffinityScreen,
    },
    {
      name: NAV_NAMES.Qr,
      component: QrScreen,
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
