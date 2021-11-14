import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {NAV_NAMES} from 'src/modules/navNames';
import {useAutoLogin} from 'src/redux/appReducer';
import { IMAGES } from 'src/modules/images';
import { JWT_TOKEN } from 'src/modules/constants';

const SplashScreen = ({route}) => {
  const navigation = useNavigation();
  const autoLogin = useAutoLogin();

  useEffect(() => {
    isAutoLoginChecked()
  }, []);

  const isAutoLoginChecked = () => {
    AsyncStorage.getItem(JWT_TOKEN).then((value) => {
      if (value) {
        autoLogin(
          value,
          (props) => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: NAV_NAMES.Home}],
              }),
            );
          },
          (props) => {
            Alert.alert('Message', props.error.message, [{text: "ok"}]);
          },
        );
      } else {
        navigation.navigate(NAV_NAMES.SignIn);
      }
    });
  };
  return (
    <Div bgWhite flex itemsCenter justifyCenter>
      <Img w150 h150 source={IMAGES.mainLogo} />
    </Div>
  );
};

export default SplashScreen;
