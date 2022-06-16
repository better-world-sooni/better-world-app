import React, {useCallback, useEffect, useState} from 'react';
import {LogBox, StatusBar} from 'react-native';
import codePush from 'react-native-code-push';
import {withRootReducer} from './src/redux/withRootReducer';
import {AppContent} from 'src/components/AppContent';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import messaging from '@react-native-firebase/messaging';
import {usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import PushNotification, {Importance} from 'react-native-push-notification';
import 'react-native-url-polyfill/auto';
import {BETTER_WORLD_MAIN_PUSH_CHANNEL} from 'src/modules/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {useGotoWithNotification} from 'src/hooks/useGotoWithNotification'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from 'src/modules/rootNavagation';
import {onMessageReceived} from 'src/modules/notification'

const App = () => {
  const {
    isLoggedIn,
    session: {token},
  } = useSelector((root: RootState) => root.app, shallowEqual);
  const firebaseMessaging = messaging();
  const gotoWithNotification = useGotoWithNotification();
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const [notificationOpenData, setNotificationOpenData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = useCallback(async () => {
    try {
      const token = await firebaseMessaging.getToken();
      if (token) return token;
    } catch (error) {}
  }, [token]);
  const setFCMToken = useCallback(async () => {
    try {
      const authorized = await firebaseMessaging.hasPermission();
      if (authorized) {
        const fcmToken = await getToken();
        const res = await postPromiseFnWithToken({
          url: apis.pushNotificationSetting.registrationToken().url,
          body: {
            token: fcmToken,
          },
        });
      } else {
        await firebaseMessaging.requestPermission();
        const fcmToken = await getToken();
        const res = await postPromiseFnWithToken({
          url: apis.pushNotificationSetting.registrationToken().url,
          body: {
            token: fcmToken,
          },
        });
      }
    } catch {}
  }, [token, isLoggedIn]);

  useEffect(() => {
    LogBox.ignoreAllLogs();
  });

  async function initialOpened() {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      setNotificationOpenData(initialNotification.notification.data)
    }
  }

  useEffect(() => {
    initialOpened().then(() => setLoading(false)).catch(console.error);
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        gotoWithNotification(detail.notification.data)
      }
    });
  }, [token]);


  useEffect(() => {
    if (isLoggedIn) {
      setFCMToken();
      const unsubscribe = firebaseMessaging.onMessage(onMessageReceived);
      return unsubscribe;
    }
  }, [isLoggedIn]);

  if (loading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor='#FFFFFF'></StatusBar>
      <NavigationContainer ref={navigationRef}>
        <NativeBaseProvider>
          <BottomSheetModalProvider>
            <AppContent notificationOpenData={notificationOpenData}/>
          </BottomSheetModalProvider>
        </NativeBaseProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(withRootReducer(App));
