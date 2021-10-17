import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TopHeader from 'src/components/TopHeader';
import React from 'react';
import BottomTabBar from 'src/components/BottomTabBar';
import {NAV_NAMES} from 'src/modules/navNames';
import HomeScreen from 'src/screens/Home/HomeScreen';
import MapScreen from 'src/screens/Home/MapScreen';
import SearchScreen from 'src/screens/SearchScreen';
import { Grid, Home, Map, MessageCircle, User, X } from 'react-native-feather';
import CameraScreen from 'src/screens/CameraScreen';
import ProfileScreen from 'src/screens/Home/ProfileScreen';
import SplashScreen from 'src/screens/Common/SplashScreen';
import SignInScreen from 'src/screens/Auth/SignInScreen';
import PostScreen from 'src/screens/PostScreen';
import SelectScreen from 'src/screens/SelectScreen';
import MetaSunganScreen from 'src/screens/Home/MetaverseScreen';
import ReportScreen from 'src/screens/ReportScreen';
import ChatManager from './ChatManager';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';

const RootStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const tabBarFunc = props => <BottomTabBar {...props} />;

const MainBottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={tabBarFunc}
      initialRouteName={NAV_NAMES.Home}>
      <Tab.Screen
        name={NAV_NAMES.Home}
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => <Home color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Home>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Metaverse}
        component={MetaSunganScreen}
        options={{
          tabBarIcon: (props) => <Grid color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Grid>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Map}
        component={MapScreen}
        options={{
          tabBarIcon: (props) => <Map color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Map>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Profile}
        component={ProfileScreen}
        options={{
          tabBarIcon: (props) => <User color={props.focused ? "black" : "gray"} strokeWidth={1.5}></User>
        }}
      />
    </Tab.Navigator>
  );
};

const topHeader = props => {
  return () => <TopHeader {...props} />;
};

export const AppContent = () => {
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
        cardStyle: { backgroundColor: 'white', presentation: 'screen'},
      }),
    },
    {
      name: NAV_NAMES.Map,
      component: MapScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'screen' },
      }),
    },
    {
      name: NAV_NAMES.Camera,
      component: CameraScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'modal' },
      }),
    },
    {
      name: NAV_NAMES.Search,
      component: SearchScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'screen' },
      }),
    },
    {
      name: NAV_NAMES.Profile,
      component: ProfileScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'transparent' }, 
      }),
    },
    {
      name: NAV_NAMES.Post,
      component: PostScreen,
      options: props => ({
        header: topHeader({...props,  title: "새 게시물"}),
        // cardStyle: { backgroundColor: 'white', presentation: 'modal' },
        headerShown: true,
      }),
    },
    {
      name: NAV_NAMES.Report,
      component: ReportScreen,
      options: props => ({
      }),
    },
    {
      name: NAV_NAMES.Select,
      component: SelectScreen,
      options: props => ({
        // header: topHeader({...props, title: "새 게시물", headerBlack: "true"}),
        cardStyle: { backgroundColor: 'black', presentation: 'screen' },
        // headerShown: true,
      }),
    },
    {
      name: NAV_NAMES.Metaverse,
      component: MetaSunganScreen,
      options: props => ({
        cardStyle: { backgroundColor: 'black', presentation: 'screen' },
      }),
    },
  ];

  const { isLoggedIn, session } = useSelector(
    (root: RootState) => (root.app),
    shallowEqual,
);

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {Navs.map((item, i) => (
            <RootStack.Screen
              key={i}
              name={item.name}
              component={item.component}
              options={item.options}
            />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
      {isLoggedIn && <ChatManager></ChatManager>}
    </>
  );
};
