import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TopHeader from 'src/components/TopHeader';
import React from 'react';
import BottomTabBar from 'src/components/BottomTabBar';
import {Div} from 'src/components/common/Div';
import {NAV_NAMES} from 'src/modules/navNames';
import { useLocale } from 'src/i18n/useLocale';
import { s_common } from 'src/i18n/text/s_common';
import HomeScreen from 'src/screens/Home/HomeScreen';
import MapScreen from 'src/screens/Home/MapScreen';
import SunganCam from 'src/screens/CameraScreen';
import SearchScreen from 'src/screens/SearchScreen';
import MoodScreen from 'src/screens/Home/MoodScreen';
import { AlertCircle, Flag, Heart, Home, Map, User } from 'react-native-feather';
import VillainScreen from 'src/screens/Home/VillainScreen';
import CameraScreen from 'src/screens/CameraScreen';
import ProfileScreen from 'src/screens/Home/ProfileScreen';

const RootStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const tabBarFunc = props => <BottomTabBar {...props} />;

const MainBottomTabs = () => {
  const {t} = useLocale();
  return (
    <Tab.Navigator
      tabBar={tabBarFunc}
      initialRouteName={NAV_NAMES.Home}>
      <Tab.Screen
        name={NAV_NAMES.Home}
        component={HomeScreen}
        options={{
          tabBarLabel: t(s_common._1_1_lesson),
          tabBarIcon: (props) => <Home color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Home>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Map}
        component={MapScreen}
        options={{
          tabBarLabel: t(s_common.home),
          tabBarIcon: (props) => <Map color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Map>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Mood}
        component={MoodScreen}
        options={{
          tabBarLabel: t(s_common.home),
          tabBarIcon: (props) => <Heart color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Heart>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Villain}
        component={VillainScreen}
        options={{
          tabBarLabel: t(s_common.log),
          tabBarIcon: (props) => <Flag color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Flag>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: t(s_common.my_page),
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
    // {
    //   name: NAV_NAMES.Splash,
    //   component: SplashScreen,
    //   options: props => ({
    //     header: topHeader({...props, headerShown: false}),
    //   }),
    // },
    // {
    //   name: NAV_NAMES.SignIn,
    //   component: SignInScreen,
    //   options: props => ({
    //     header: topHeader({...props, headerShown: false}),
    //   }),
    // } as any,
    {
      name: NAV_NAMES.Home,
      component: MainBottomTabs,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white' },
      }),
    },
    {
      name: NAV_NAMES.Map,
      component: MapScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'modal' },
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
      name: NAV_NAMES.Villain,
      component: VillainScreen,
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
        cardStyle: { backgroundColor: 'white', presentation: 'modal' },
      }),
    },
    {
      name: NAV_NAMES.Mood,
      component: MoodScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'modal' },
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
  ];
  return (
    // <Div flex={1} borderBottomLeftRadius={10} borderBottomRightRadius={10}>
      <NavigationContainer>
        <RootStack.Navigator headerMode="screen">
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
    // </Div>
  );
};
