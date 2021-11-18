import React, {useCallback, useEffect, useState} from 'react';
import {Alert, LogBox} from 'react-native';
import codePush from 'react-native-code-push';
import {withRootReducer} from './src/redux/withRootReducer';
import {AppContent} from 'src/components/AppContent';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faWalking, faBus, faSubway} from '@fortawesome/free-solid-svg-icons';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {setMetasunganUser} from 'src/redux/metasunganReducer';
import {Manager} from 'socket.io-client';
import {setChatSocket} from 'src/redux/chatReducer';
import messaging from '@react-native-firebase/messaging';
import {postPromiseFn} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import PushNotification from 'react-native-push-notification';

library.add(faWalking, faBus, faSubway);

const App = () => {
  const {
    isLoggedIn,
    session: {token},
  } = useSelector((root: RootState) => root.app, shallowEqual);
  const dispatch = useDispatch();
  const login = useCallback(
    loginParams => {
      dispatch(setMetasunganUser(loginParams.user));
    },
    [dispatch],
  );
  const firebaseMessaging = messaging();
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
        const res = await postPromiseFn({
          url: APIS.push.registrationToken().url,
          body: {
            token: fcmToken,
          },
          token: token,
        });
        console.log('console.log(fcmToken)', fcmToken);
      } else {
        const fcmToken = await getToken();
        await firebaseMessaging.requestPermission();
        const res = await postPromiseFn({
          url: APIS.push.registrationToken().url,
          body: {
            token: fcmToken,
          },
          token: token,
        });
        console.log('console.log(fcmToken)', fcmToken);
      }
    } catch (error) {
      console.log(`Error while saving fcm token: ${error}`);
    }
  }, [token]);
  useEffect(() => {
    // LogBox.ignoreAllLogs();
    // LogBox.ignoreLogs(['Warning: ...']);
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      const BACKEND_URL = 'https://ws.metasgid.com';
      const manager = new Manager(BACKEND_URL, {
        reconnectionDelayMax: 5000,
        forceNew: true,
      });
      const newSocket = manager.socket('/chat', {
        auth: {
          token: token,
        },
      });
      newSocket.on('login', login);
      newSocket.on('disconnnect', () => dispatch(setChatSocket(null)));
      dispatch(setChatSocket(newSocket));
      return () => {
        newSocket.off('login');
        newSocket.off('disconnnect');
        newSocket.close();
        dispatch(setChatSocket(null));
      };
    }
  }, [isLoggedIn]);
  useEffect(() => {
    if (isLoggedIn) {
      setFCMToken();
      firebaseMessaging.onNotificationOpenedApp(remoteMessage => {});
      firebaseMessaging.getInitialNotification().then(remoteMessage => {});
      const unsubscribe = firebaseMessaging.onMessage(async remoteMessage => {
        const notification = {
          foreground: true, // BOOLEAN: If the notification was received in foreground or not
          userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
          message: remoteMessage.notification.body, // STRING: The notification message
          title: remoteMessage.notification.title, // STRING: The notification title
          data: remoteMessage.data, // OBJECT: The push data or the defined userInfo in local notifications
        };
        PushNotification.localNotification(notification);
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
