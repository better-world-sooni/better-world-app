import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TopHeader from 'src/components/TopHeader';
import React from 'react';
import BottomTabBar from 'src/components/BottomTabBar';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {NAV_NAMES} from 'src/modules/navNames';
import { useLocale } from 'src/i18n/useLocale';
import { s_common } from 'src/i18n/text/s_common';
import HomeScreen from 'src/screens/Home/HomeScreen';

const RootStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const tabBarFunc = props => <BottomTabBar {...props} />;

const MainBottomTabs = () => {
  const {t} = useLocale();
  return (
    <Tab.Navigator
      tabBar={tabBarFunc}
      initialRouteName={NAV_NAMES.MainTab_Home}>
      <Tab.Screen
        name={NAV_NAMES.MainTab_1_1_lesson}
        component={HomeScreen}
        options={{
          tabBarLabel: t(s_common._1_1_lesson),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.MainTab_Home}
        component={HomeScreen}
        options={{
          tabBarLabel: t(s_common.home),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.MainTab_Log}
        component={HomeScreen}
        options={{
          tabBarLabel: t(s_common.log),
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.MainTab_Mypage}
        component={HomeScreen}
        options={{
          tabBarLabel: t(s_common.my_page),
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
      }),
    },
  ];
  return (
    <Div flex={1} bgDanger>
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
    </Div>
  );
};
