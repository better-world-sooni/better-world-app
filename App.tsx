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
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    LogBox.ignoreLogs([
      'Sending `onAnimatedValueUpdate` with no listeners registered',
    ]);
    LogBox.ignoreLogs([
      'Remote debugger is in a background tab which may cause apps to perform slowly.',
    ]);
    // LogBox.ignoreAllLogs();
    // LogBox.ignoreLogs(['Warning: ...']);
  }, []);

  useEffect(() => {
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
    // newSocket.on('disconnnect', () => dispatch(setChatSocket(null)));
    dispatch(setChatSocket(newSocket));
    return () => {
      newSocket.off('login');
      // newSocket.off('disconnnect');
      newSocket.close();
      dispatch(setChatSocket(null));
    };
  }, [token, isLoggedIn]);

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) return token;
    } catch (error) {}
  };

  const setFCMToken = async () => {
    try {
      const authorized = await messaging().hasPermission();
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
        await messaging().requestPermission();
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
  };

  useEffect(() => {
    if (isLoggedIn) {
      setFCMToken();
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        // setInitialRoute(remoteMessage.data.goTo);
      });
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
            // setInitialRoute(remoteMessage.data.goTo); // e.g. "Settings"
          }
        });
    }
    const unsubscribe = messaging().onMessage(async remoteMessage => {
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
  }, [isLoggedIn]);

  return <AppContent />;
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(withRootReducer(App));
