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
import { navigationRef } from 'src/modules/rootNavagation';

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
  const gotoWithNotification = useGotoWithNotification();
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


  const onDisplayNotification = async(title, body, data) => {
    const channelId  = await notifee.createChannel({
      id: BETTER_WORLD_MAIN_PUSH_CHANNEL,
      name: BETTER_WORLD_MAIN_PUSH_CHANNEL,
      lights: false,
      vibration: true,
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
      },
      data
    });
  }

  const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
    if(type === EventType.PRESS) {
      console.log('User pressed notification', detail.notification.data.post_id);
      gotoWithNotification(detail.notification.data)
    }
  })

  useEffect(() => {
    return unsubscribe();
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      

    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
        console.log("error")
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setFCMToken();
      const unsubscribe = firebaseMessaging.onMessage(async remoteMessage => {
        const dataJSONWithStrings = JSON.parse(remoteMessage.data.data, (key, val) => (
          typeof val !== 'object' && val !== null ? String(val) : val
        ));
        onDisplayNotification(remoteMessage.data.title, remoteMessage.data.body, dataJSONWithStrings);
      });
      return unsubscribe;
    }
  }, [isLoggedIn]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor='#FFFFFF'></StatusBar>
      <NavigationContainer ref={navigationRef}>
        <NativeBaseProvider>
          <BottomSheetModalProvider>
            <AppContent />
          </BottomSheetModalProvider>
        </NativeBaseProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

// firebaseMessaging.setBackgroundMessageHandler(async remoteMessage => {
//   console.log("back", remoteMessage)
//   const notification = {
//     channelId: BETTER_WORLD_MAIN_PUSH_CHANNEL,
//     foreground: false, // BOOLEAN: If the notification was received in foreground or not
//     userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
//     message: remoteMessage.notification.body, // STRING: The notification message
//     title: remoteMessage.notification.title, // STRING: The notification title
//     data: remoteMessage.data, // OBJECT: The push data or the defined userInfo in local notifications
//     vibrate: false,
//   };
//   // PushNotification.localNotification(notification);
// });

export default codePush(codePushOptions)(withRootReducer(App));
