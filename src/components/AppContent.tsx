import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
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
import {Home, Search} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import OtherProfileScreen from 'src/screens/OtherProfileScreen';
import NftCollectionScreen from 'src/screens/NftCollectionScreen';
import CapsuleScreen from 'src/screens/Home/CapsuleScreen';
import NewPostScreen from 'src/screens/NewPostScreen';
import ReportScreen from 'src/screens/ReportScreen';
import SearchScreen from 'src/screens/SearchScreen';
import ChatListScreen from 'src/screens/ChatListScreen';

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
      initialRouteName={NAV_NAMES.Home}
      detachInactiveScreens={true}>
      <Tab.Screen
        name={NAV_NAMES.Home}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
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
          tabBarLabel: 'Search',
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
        name={NAV_NAMES.Capsule}
        component={CapsuleScreen}
        options={{
          unmountOnBlur: true,
          tabBarLabel: 'Capsule',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Img h20 w20 source={ICONS.capsuleIconWhite}></Img>
            ) : (
              <Img h20 w20 source={ICONS.capsuleIconGray}></Img>
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

  const Navs = [
    {
      name: NAV_NAMES.Splash,
      component: SplashScreen,
    },
    {
      name: NAV_NAMES.SignIn,
      component: SignInScreen,
    } as any,
    {
      name: NAV_NAMES.Home,
      component: MainBottomTabs,
      options: props => ({
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
      name: NAV_NAMES.ChatList,
      component: ChatListScreen,
    },
    {
      name: NAV_NAMES.ChatRoom,
      component: ChatRoomScreen,
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
    <Div flex={1} relative>
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
