import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Alert, StatusBar} from 'react-native';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {NAV_NAMES} from 'src/modules/navNames';
import {useAutoLogin} from 'src/redux/appReducer';
import { IMAGES } from 'src/modules/images';
import {JWT} from 'src/modules/constants';
import {Span} from 'src/components/common/Span';
import {useGotoHome, useGotoPost, useGotoNftProfile} from 'src/hooks/useGoto';

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

  return (
    <Div bgWhite flex={1} itemsCenter justifyCenter>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="rgb(25, 110, 237)"></StatusBar>
      <Div itemsCenter>
        <Img w80 h80 source={IMAGES.bW} legacy />
      </Div>
    </Div>
  );
};

export default SplashScreen;
