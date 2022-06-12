import React, {useCallback, useEffect} from 'react';
import {LogBox, StatusBar} from 'react-native';
import codePush from 'react-native-code-push';
import {withRootReducer} from './src/redux/withRootReducer';
import {AppContent} from 'src/components/AppContent';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import messaging from '@react-native-firebase/messaging';
import {postPromiseFn, usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import PushNotification, {Importance} from 'react-native-push-notification';
import 'react-native-url-polyfill/auto';
import {BETTER_WORLD_MAIN_PUSH_CHANNEL} from 'src/modules/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const firebaseMessaging = messaging();
PushNotification.createChannel({
  channelId: BETTER_WORLD_MAIN_PUSH_CHANNEL, // (required)
  channelName: BETTER_WORLD_MAIN_PUSH_CHANNEL, // (required)
  channelDescription: 'Main Channel', // (optional) default: undefined.
  playSound: false, // (optional) default: true
  soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
  importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
});

const App = () => {
  const {
    isLoggedIn,
    session: {token},
  } = useSelector((root: RootState) => root.app, shallowEqual);
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
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
        console.log(fcmToken);
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

  useEffect(() => {
    if (isLoggedIn) {
      setFCMToken();
      const unsubscribe = firebaseMessaging.onMessage(async remoteMessage => {
        const notification = {
          channelId: BETTER_WORLD_MAIN_PUSH_CHANNEL,
          foreground: true, // BOOLEAN: If the notification was received in foreground or not
          userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
          message: remoteMessage.notification.body, // STRING: The notification message
          title: remoteMessage.notification.title, // STRING: The notification title
          data: remoteMessage.data, // OBJECT: The push data or the defined userInfo in local notifications
          vibrate: false,
        };
        PushNotification.localNotification(notification);
      });
      return unsubscribe;
    }
  }, [isLoggedIn]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor='#FFFFFF'></StatusBar>
      <AppContent />
    </GestureHandlerRootView>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

firebaseMessaging.setBackgroundMessageHandler(async remoteMessage => {
  const notification = {
    channelId: BETTER_WORLD_MAIN_PUSH_CHANNEL,
    foreground: false, // BOOLEAN: If the notification was received in foreground or not
    userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
    message: remoteMessage.notification.body, // STRING: The notification message
    title: remoteMessage.notification.title, // STRING: The notification title
    data: remoteMessage.data, // OBJECT: The push data or the defined userInfo in local notifications
    vibrate: false,
  };
  PushNotification.localNotification(notification);
});

export default codePush(codePushOptions)(withRootReducer(App));
// export default withRootReducer(App);
