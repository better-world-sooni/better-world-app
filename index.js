/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

// PushNotification.configure({
//   onNotification(notification) {
//   if (isIos) {
//     if (
//       notification.foreground &&
//       (notification.userInteraction || notification.remote)
//     ) {
//       PushNotification.localNotification(notification);
//     }
//     notification.finish(PushNotificationIOS.FetchResult.NoData);
//   } else {
//     if (notification.foreground) {
//       PushNotification.localNotification(notification);
//     }
//   }
// },
//   onRegistrationError: function(err) {
//     console.error(err.message, err);
//   },
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },
//   popInitialNotification: true,
//   requestPermissions: true,
// });


AppRegistry.registerComponent( 'sungan', () => App );
