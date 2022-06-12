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
import { SafeAreaView } from 'react-native-safe-area-context';
import {useGotoHome} from 'src/hooks/useGoto';

const SplashScreen = ({route}) => {
  const navigation = useNavigation();
  const autoLogin = useAutoLogin();
  const gotoHome = useGotoHome();

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
              gotoHome();
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
      <Div bgPrimary flex={1} itemsCenter justifyCenter>
        <StatusBar barStyle="dark-content" backgroundColor='rgb(25, 110, 237)'></StatusBar>
        <Div itemsCenter pb50>
          <Img w134 h134 source={IMAGES.betterWorldWhiteLogo} legacy />
          <Span white fontSize={20} mt={-15} fontFamily={'UniSans'}>
            BetterWorld{' '}
            <Span white bold fontSize={20}>
              alpha
            </Span>
          </Span>
        </Div>
      </Div>
  );
};

export default SplashScreen;
