import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TopHeader from 'src/components/TopHeader';
import React, {useEffect, useState} from 'react';
import BottomTabBar from 'src/components/BottomTabBar';
import {NAV_NAMES} from 'src/modules/navNames';
import HomeScreen from 'src/screens/Home/HomeScreen';
import {Grid, Home, Map, MessageCircle, User, X} from 'react-native-feather';
import ProfileScreen from 'src/screens/Home/ProfileScreen';
import SplashScreen from 'src/screens/Common/SplashScreen';
import SignInScreen from 'src/screens/Auth/SignInScreen';
import PostScreen from 'src/screens/PostScreen';
import MetaSunganScreen from 'src/screens/Home/MetaverseScreen';
import ReportScreen from 'src/screens/ReportScreen';
import ChatManager from './ChatManager';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import ChatScreen from 'src/screens/Home/ChatScreen';
import {Div} from './common/Div';
import ChatRoomScreen from 'src/screens/ChatRoomScreen';
import PostDetailScreen from 'src/screens/PostDetailScreen';
import SignUpSceen from 'src/screens/Auth/SignUpScreen';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/core';
import { postPromiseFn } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import {LINE2_COLOR} from 'src/modules/constants';

const RootStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const tabBarFunc = props => <BottomTabBar {...props} />;

const MainBottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={tabBarFunc}
      initialRouteName={NAV_NAMES.Home}
      detachInactiveScreens={true}>
      <Tab.Screen
        name={NAV_NAMES.Home}
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          unmountOnBlur: true,
          tabBarIcon: props => (
            <Home
              color={props.focused ? LINE2_COLOR : 'gray'}
              strokeWidth={1.5}></Home>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Metaverse}
        component={MetaSunganScreen}
        options={{
          tabBarLabel: '메타순간',
          unmountOnBlur: true,
          tabBarIcon: props => (
            <Grid
              color={props.focused ? LINE2_COLOR : 'gray'}
              strokeWidth={1.5}></Grid>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Chat}
        component={ChatScreen}
        options={{
          tabBarLabel: '채팅',
          unmountOnBlur: true,
          tabBarIcon: props => (
            <MessageCircle
              color={props.focused ? LINE2_COLOR : 'gray'}
              strokeWidth={1.5}></MessageCircle>
          ),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: '프로필',
          unmountOnBlur: true,
          tabBarIcon: props => (
            <User
              color={props.focused ? LINE2_COLOR : 'gray'}
              strokeWidth={1.5}></User>
          ),
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
      name: NAV_NAMES.SignUp,
      component: SignUpSceen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
      }),
    } as any,
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
  ];

  return (
    <Div flex relative>
      <NavigationContainer>
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
      </NavigationContainer>
      {isLoggedIn && <ChatManager></ChatManager>}
    </Div>
  );
};
