import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, StatusBar} from 'react-native';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {NAV_NAMES} from 'src/modules/navNames';
import {useAutoLogin} from 'src/redux/appReducer';
import { IMAGES } from 'src/modules/images';
import {HAS_AGREED_TO_UGC, JWT} from 'src/modules/constants';
import {Span} from 'src/components/common/Span';
import {
  useGotoHome,
  useGotoPost,
  useGotoNftProfile,
  useGotoChatRoomFromNotification,
  useGotoUgcConfirmation,
} from 'src/hooks/useGoto';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const getInitialRoute = routeParams => {
  if (routeParams.notificationOpened) {
    if (routeParams.routeDestination.navName === NAV_NAMES.Post) {
      return {
        gotoInitial: useGotoPost(routeParams.routeDestination.id),
        params: [false, true],
      };
    } else if (
      routeParams.routeDestination.navName === NAV_NAMES.OtherProfile
    ) {
      return {
        gotoInitial: useGotoNftProfile({nft: routeParams.routeDestination.id}),
        params: [true],
      };
    } else if (routeParams.routeDestination.navName === NAV_NAMES.ChatRoom) {
      return {
        gotoInitial: useGotoChatRoomFromNotification(
          routeParams.routeDestination.id,
        ),
        params: [],
      };
    }
  } else {
    return {
      gotoInitial: useGotoHome(),
      params: [],
    };
  }
};

const SplashScreen = ({route}) => {
  const navigation = useNavigation();
  const autoLogin = useAutoLogin();
  const routeParams = route.params;
  const initialRoute = getInitialRoute(routeParams);
  const gotoUgcConfirmation = useGotoUgcConfirmation();

  useEffect(() => {
    logoAnimation();
    isUgcConfirmed();
  }, []);

  const isUgcConfirmed = async () => {
    const ugcConfirmed = await AsyncStorage.getItem(HAS_AGREED_TO_UGC);
    if (ugcConfirmed) {
      isAutoLoginChecked();
    } else {
      gotoUgcConfirmation({
        onConfirm: () => {
          AsyncStorage.setItem(HAS_AGREED_TO_UGC, 'TRUE', isAutoLoginChecked);
        },
      });
    }
  };

  const isAutoLoginChecked = () => {
    AsyncStorage.getItem(JWT).then(async value => {
      if (value) {
        await autoLogin(
          value,
          props => {
            if (props.data.user.main_nft) {
              initialRoute.gotoInitial(...initialRoute.params, props.data.jwt);
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
  const bwLogo1Scale = useSharedValue(0.05);
  const bwLogo2Scale = useSharedValue(1);
  const bwLogo3Scale = useSharedValue(0);
  const bwLogo1Style = useAnimatedStyle(() => {
    return {
      width: 1600,
      height: 1600,
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
  const bwLogo3Style = useAnimatedStyle(() => {
    return {
      width: 160,
      height: 160,
      transform: [
        {
          scale: bwLogo3Scale.value,
        },
      ],
    };
  });
  const logoAnimation = () => {
    bwLogo1Scale.value = withDelay(1000, withTiming(1, {duration: 1000}));
    bwLogo2Scale.value = withDelay(1200, withTiming(0, {duration: 800}));
    bwLogo3Scale.value = withDelay(1200, withTiming(1, {duration: 800}));
  };
  return (
    <Div bgWhite flex={1} itemsCenter justifyCenter>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Div itemsCenter>
        <Div absolute w80 h80 top={-40} itemsCenter justifyCenter>
          <Animated.Image style={bwLogo1Style} source={IMAGES.bwLogo1} />
        </Div>
        <Div absolute w80 h80 top={-40} itemsCenter justifyCenter>
          <Animated.Image style={bwLogo3Style} source={IMAGES.bwLogoWhite} />
        </Div>
      </Div>
    </Div>
  );
};

export default SplashScreen;
