import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TopHeader from 'src/components/TopHeader';
import React from 'react';
import BottomTabBar from 'src/components/BottomTabBar';
import {NAV_NAMES} from 'src/modules/navNames';
import HomeScreen from 'src/screens/Home/HomeScreen';
import ProfileScreen from 'src/screens/Home/ProfileScreen';
import SplashScreen from 'src/screens/Common/SplashScreen';
import SignInScreen from 'src/screens/Auth/SignInScreen';
import PostScreen from 'src/screens/PostScreen';
import MetaSunganScreen from 'src/screens/Home/MetaverseScreen';
import ReportScreen from 'src/screens/ReportScreen';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import ChatScreen from 'src/screens/Home/ChatScreen';
import {Div} from './common/Div';
import ChatRoomScreen from 'src/screens/ChatRoomScreen';
import PostDetailScreen from 'src/screens/PostDetailScreen';
import NotificationScreen from 'src/screens/NotificationScreen';
import OnboardingScreen from 'src/screens/Auth/OnboardingScreen';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NativeBaseProvider} from 'native-base';
import {ICONS} from 'src/modules/icons';
import {Img} from './common/Img';
import {getNftProfileImage} from 'src/modules/nftUtils';

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
        w: 22,
        h: 22,
        rounded: 100,
      }
    : {source: ICONS.profileIcon, h: 18, w: 18};
  return (
    <Tab.Navigator
      tabBar={tabBarFunc}
      initialRouteName={NAV_NAMES.Home}
      detachInactiveScreens={true}>
      <Tab.Screen
        name={NAV_NAMES.Home}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: props => <Img h18 w18 source={ICONS.homeIcon}></Img>,
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Metaverse}
        component={MetaSunganScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: props => <Img h18 w18 source={ICONS.capsuleIcon}></Img>,
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Chat}
        component={ChatScreen}
        options={{
          tabBarLabel: 'Capsule',
          tabBarIcon: props => <Img h18 w18 source={ICONS.searchIcon}></Img>,
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: NAV_NAMES.Profile,
          tabBarIcon: props => <Img {...profileTabIconProps}></Img>,
        }}
      />
    </Tab.Navigator>
  );
};

const topHeader = props => {
  return () => <TopHeader {...props} />;
};

export const AppContent = () => {
  const {
    isLoggedIn,
    session: {token},
  } = useSelector((root: RootState) => root.app, shallowEqual);

  const Navs = [
    {
      name: NAV_NAMES.Splash,
      component: SplashScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
      }),
    },
    {
      name: NAV_NAMES.SignIn,
      component: SignInScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
      }),
    } as any,
    {
      name: NAV_NAMES.Home,
      component: MainBottomTabs,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: {backgroundColor: 'white', presentation: 'screen'},
      }),
    },
    {
      name: NAV_NAMES.Profile,
      component: ProfileScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: {backgroundColor: 'transparent'},
      }),
    },
    {
      name: NAV_NAMES.Post,
      component: PostScreen,
      options: props => ({
        header: topHeader({...props, title: '새 게시물'}),
      }),
    },
    {
      name: NAV_NAMES.Report,
      component: ReportScreen,
      options: props => ({}),
    },
    {
      name: NAV_NAMES.Metaverse,
      component: MetaSunganScreen,
      options: props => ({
        cardStyle: {backgroundColor: 'black', presentation: 'screen'},
      }),
    },
    {
      name: NAV_NAMES.Chat,
      component: ChatScreen,
      options: props => ({
        cardStyle: {backgroundColor: 'black', presentation: 'screen'},
      }),
    },
    {
      name: NAV_NAMES.ChatRoom,
      component: ChatRoomScreen,
      options: props => ({
        cardStyle: {backgroundColor: 'black', presentation: 'screen'},
      }),
    },
    {
      name: NAV_NAMES.PostDetail,
      component: PostDetailScreen,
      options: props => ({
        cardStyle: {backgroundColor: 'black', presentation: 'screen'},
      }),
    },
    {
      name: NAV_NAMES.Notification,
      component: NotificationScreen,
      options: props => ({
        cardStyle: {backgroundColor: 'black', presentation: 'screen'},
      }),
    },
    {
      name: NAV_NAMES.Onboarding,
      component: OnboardingScreen,
      options: props => ({
        cardStyle: {backgroundColor: 'black', presentation: 'screen'},
      }),
    },
  ];

  return (
    <Div flex relative>
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
                />
              ))}
            </RootStack.Navigator>
          </BottomSheetModalProvider>
        </NativeBaseProvider>
      </NavigationContainer>
    </Div>
  );
};
