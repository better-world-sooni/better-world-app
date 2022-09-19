import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, StatusBar} from 'react-native';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {NAV_NAMES} from 'src/modules/navNames';
import {useAutoLogin} from 'src/redux/appReducer';
import { IMAGES } from 'src/modules/images';
import {JWT} from 'src/modules/constants';
import {Span} from 'src/components/common/Span';
import {useGotoHome, useGotoPost, useGotoNftProfile, useGotoChatRoomFromNotification} from 'src/hooks/useGoto';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const getInitialRoute = (routeParams) => {
  if(routeParams.notificationOpened) {
    if(routeParams.routeDestination.navName === NAV_NAMES.Post) {
      return {
        gotoInitial: useGotoPost(routeParams.routeDestination.id),
        params: [false, true] 
      }

    }
    else if(routeParams.routeDestination.navName === NAV_NAMES.OtherProfile) {
      return {
        gotoInitial: useGotoNftProfile({nft: routeParams.routeDestination.id}),
        params: [true] 
      }
    }
    else if(routeParams.routeDestination.navName === NAV_NAMES.ChatRoom) {
      return {
        gotoInitial: useGotoChatRoomFromNotification(routeParams.routeDestination.id),
        params: []
      }
    }
  }
  else {
    return {
      gotoInitial: useGotoHome(),
      params: [] 
    }
  }
}

const SplashScreen = ({route}) => {
  const navigation = useNavigation();
  const autoLogin = useAutoLogin();
  const routeParams = route.params
  const initialRoute = getInitialRoute(routeParams)

  useEffect(() => {
    logoAnimation()
    isAutoLoginChecked();
  }, []);

  const isAutoLoginChecked = () => {
    AsyncStorage.getItem(JWT).then(value => {
      if (value) {
        autoLogin(
          value,
          props => {
            if (props.data.user.main_nft) {
              initialRoute.gotoInitial(...initialRoute.params, props.data.jwt)
              return;
            }
            if (props.data.user.nfts.length == 0) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: NAV_NAMES.SignIn}],
                }),
              );
              return;
            }
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: NAV_NAMES.Onboarding}],
              }),
            );
          },
          props => {
            navigation.navigate(NAV_NAMES.SignIn as never);
          },
        );
      } else {
        navigation.navigate(NAV_NAMES.SignIn as never);
      }
    });
  };
  const bwLogo1Scale = useSharedValue(1);
  const bwLogo2Scale = useSharedValue(1);
  const bwWordOpacity = useSharedValue(0);
  const bwLogo1Style = useAnimatedStyle(() => {
    return {
      width: 80,
      height: 80,
      transform: [
        {
          scale: bwLogo1Scale.value,
        },
      ],
    };
  });
  const bwLogo2Style = useAnimatedStyle(() => {
    return {
      width: 80,
      height: 80,
      transform: [
        {
          scale: bwLogo2Scale.value,
        },
      ],
    };
  });
  const bwWordStyle = useAnimatedStyle(() => {
    return {
      width: 280,
      height: 40,
      opacity: bwWordOpacity.value,
    };
  });
  const logoAnimation = () => {
    bwLogo1Scale.value=withDelay(1000, withTiming(20, { duration: 1000 }));
    bwLogo2Scale.value=withDelay(1200, withTiming(2, { duration: 800 }));
    bwWordOpacity.value=withDelay(2000, withTiming(1, { duration: 500 }));
  }
  return (
    <Div bgWhite flex={1} itemsCenter justifyCenter>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Div itemsCenter>
        <Div absolute w80 h80 top={-40} itemsCenter justifyCenter><Animated.Image style={bwLogo1Style} source={IMAGES.bwLogo1}/></Div>
        <Div absolute w80 h80 top={-40} itemsCenter justifyCenter><Animated.Image style={bwLogo2Style} source={IMAGES.bwLogo2}/></Div>
        <Div top={55}><Animated.Image style={bwWordStyle} source={IMAGES.bwWord}/></Div>
      </Div>
    </Div>
  );
};

export default SplashScreen;
