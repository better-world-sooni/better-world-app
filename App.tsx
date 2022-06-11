import React, {useCallback, useEffect} from 'react';
import {LogBox} from 'react-native';
import codePush from 'react-native-code-push';
import {withRootReducer} from './src/redux/withRootReducer';
import {AppContent} from 'src/components/AppContent';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import messaging from '@react-native-firebase/messaging';
import {postPromiseFn, usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import PushNotification from 'react-native-push-notification';
import 'react-native-url-polyfill/auto';

const App = () => {
  const {
    isLoggedIn,
    session: {token},
  } = useSelector((root: RootState) => root.app, shallowEqual);
  const firebaseMessaging = messaging();
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
        // const notification = {
        //   foreground: true, // BOOLEAN: If the notification was received in foreground or not
        //   userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
        //   message: remoteMessage.notification.body, // STRING: The notification message
        //   title: remoteMessage.notification.title, // STRING: The notification title
        //   data: remoteMessage.data, // OBJECT: The push data or the defined userInfo in local notifications
        //   vibrate: false,
        // };
        // PushNotification.localNotification(notification);
        console.log(remoteMessage);
      });

      return unsubscribe;
    }
  }, [isLoggedIn]);

  return <AppContent />;
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(withRootReducer(App));
// export default withRootReducer(App);
