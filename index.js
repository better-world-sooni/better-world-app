/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {onMessageReceived} from 'src/modules/notification'
import notifee, { EventType } from '@notifee/react-native';
import 'react-native-gesture-handler'

messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
        // Remove the notification
        await notifee.cancelNotification(notification.id);
    }
});

AppRegistry.registerComponent( appName, () => App );
