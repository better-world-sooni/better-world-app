import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, AppState, Linking, Platform} from 'react-native';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import APIS from 'src/modules/apis';
import {ICONS} from 'src/modules/icons';
import {NAV_NAMES} from 'src/modules/navNames';
import {
  ANDROID_APP_VERSION,
  ANDROID_DOWNLOAD_URL,
  IOS_APP_VERSION,
  IOS_DOWNLOAD_URL,
  JWT_TOKEN,
  RINGLE,
} from 'src/modules/contants';
import {useAutoLogin} from 'src/redux/appReducer';
import {useApiGET} from 'src/redux/asyncReducer';
import { IMAGES } from 'src/modules/images';

const SplashScreen = ({route}) => {
  const navigation = useNavigation();
  const apiGET = useApiGET();
  const autoLogin = useAutoLogin();

  useEffect(() => {
    // executeVersionCheckQuery();
  }, []);

  useEffect(() => {
    // AppState.addEventListener('change', (appState) =>
    //   handleAppStateChange(appState),
    // );

    // return () => {
    //   AppState.removeEventListener('change', (appState) =>
    //     handleAppStateChange(appState),
    //   );
    // };
    isAutoLoginChecked()
  }, []);

  // const handleAppStateChange = (appState) => {
  //   if (appState === 'active' && navigation.isFocused()) {
  //     executeVersionCheckQuery();
  //   }
  // };
  // const executeVersionCheckQuery = () => {
  //   apiGET(APIS.version(Platform.OS, RINGLE), ({data}) => {
  //     console.log(data.response);
  //     const version =
  //       Platform.OS === 'ios' ? IOS_APP_VERSION : ANDROID_APP_VERSION;
  //     const mostRecentVersion = data.response.most_recent_version;
  //     const downloadUrl = data.response.download_url
  //       ? data.response.download_url
  //       : Platform.OS === 'ios'
  //       ? IOS_DOWNLOAD_URL
  //       : ANDROID_DOWNLOAD_URL;
  //     if (version < mostRecentVersion) {
  //       Alert.alert('Update', t(s_common.new_version_of_this_application_is_available), [
  //         {
  //           text: t(s_common.ok),
  //           onPress: () => {
  //             Linking.canOpenURL(downloadUrl)
  //               .then((supported) => {
  //                 if (!supported) {
  //                   console.log("Can't handle url: " + downloadUrl);
  //                 } else {
  //                   return Linking.openURL(downloadUrl);
  //                 }
  //               })
  //               .catch((err) => console.error('An error occurred', err));
  //           },
  //         },
  //       ]);
  //     } else {
  //       // autoLogin(
  //       //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjozMTgxLCJleHAiOjE2NDUyMzI2NjgwMDB9.XVzT26IBR3FNwf6SdQWQftSYQG5Bl06vdaLoPnjsJNwHgUy8sbDGVcBkPrywKhyM1rgPnyHr2rIAxBPTgrWIggECfBjk8m7G5E7v_j9LhvnsXFrj9zgG-iIcQ8fB6BkkshYQ9mAw0SbxhUzxXt3ufnzfqN6ow_2AKEIK_i0agSwVxjigdXxWzHVohDmPLDX9BZC26iZLDZNufCQAYqsfjjWGt2t1aGFhM9E9lhOqRJx6sfWfHCZW78UB1Vwj9Q7wGbAQbITjb5PwYk5V0NaIko-jb6Kym-vnXJKKJw668LJkY9o757CVadKmUarv4ubxGEOIDHk-TxvvspLwmJA9AA',
  //       //   (props) => {
  //       //     navigation.dispatch(
  //       //       CommonActions.reset({
  //       //         index: 1,
  //       //         routes: [{name: NAV_NAMES.Home}],
  //       //       }),
  //       //     );
  //       //   },
  //       //   (props) => {
  //       //     Alert.alert('Message', props.error.message, [{text: '확인'}]);
  //       //   },
  //       // );
  //       isAutoLoginChecked();
  //     }
  //   });
  // };

  const isAutoLoginChecked = () => {
    AsyncStorage.getItem(JWT_TOKEN).then((value) => {
      console.log(value);
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
    // navigation.navigate(NAV_NAMES.SignIn);
  };
  return (
    <Div bgWhite flex itemsCenter justifyCenter>
      <Img w150 h150 source={IMAGES.mainLogo} />
    </Div>
  );
};

export default SplashScreen;
