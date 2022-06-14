import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
import {Div} from './common/Div';
import ChatRoomScreen from 'src/screens/ChatRoomScreen';
import OnboardingScreen from 'src/screens/Auth/OnboardingScreen';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NativeBaseProvider} from 'native-base';
import {ICONS} from 'src/modules/icons';
import {Img} from './common/Img';
import {getNftProfileImage} from 'src/modules/nftUtils';
import {Bell, Home, Search, Send} from 'react-native-feather';
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
import RankSeasonScreen from 'src/screens/RankSeasonScreen';
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// const RootStack = createNativeStackNavigator();
const RootStack = createStackNavigator();


const Tab = createBottomTabNavigator();

const tabBarFunc = props => <BottomTabBar {...props} />;

const MainBottomTabs = () => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const profileTabIconProps = currentNft
    ? {
        uri: getNftProfileImage(currentNft, 50, 50),
        w: 24,
        h: 24,
        rounded: 100,
      }
    : {source: ICONS.profileIcon, h: 20, w: 20};
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
        name={NAV_NAMES.ChatList}
        component={ChatListScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Send
              width={22}
              height={22}
              strokeWidth={2}
              color={focused ? 'black' : Colors.gray[400]}></Send>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: NAV_NAMES.Profile,
          tabBarIcon: ({focused}) => (
            <Img
              {...profileTabIconProps}
              border1={focused}
              borderBlack={focused}></Img>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppContent = () => {
  const {
    isLoggedIn,
    session: {token},
  } = useSelector((root: RootState) => root.app, shallowEqual);

  const testConst = NAV_NAMES.Post
  const testConst2 = 135

  const Navs = [
    {
      name: NAV_NAMES.Splash,
      component: SplashScreen,
      initialParams: {
        notificationOpened: true,
        routeDestination: {
          navName: testConst,
          id: testConst2
        }
      }
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
      name: NAV_NAMES.RankSeason,
      component: RankSeasonScreen,
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
  ];

  return (
      <NavigationContainer>
        <NativeBaseProvider>
          <BottomSheetModalProvider>
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
          </BottomSheetModalProvider>
        </NativeBaseProvider>
      </NavigationContainer>
  );
};
