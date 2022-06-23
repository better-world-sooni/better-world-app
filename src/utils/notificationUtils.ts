import notifee, { AndroidImportance } from '@notifee/react-native';
import { createNavigationContainerRef } from '@react-navigation/native';
import {BETTER_WORLD_MAIN_PUSH_CHANNEL} from 'src/modules/constants';

export const navigationRef = createNavigationContainerRef()

export function notificationNavigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params as never);
    } 
    else {
        console.log("navigation not ready")
    }
}

const onDisplayNotification = async(title, body, data) => {
    const channelId  = await notifee.createChannel({
        id: BETTER_WORLD_MAIN_PUSH_CHANNEL,
        name: BETTER_WORLD_MAIN_PUSH_CHANNEL,
        lights: false,
        vibration: true,
        importance: AndroidImportance.HIGH,
    });
    notifee.displayNotification({
        title,
        body,
        android: {
            channelId,
            pressAction: {
                id: 'default',
            },
        },
        data
    });
}
export async function onMessageReceived(message) {
    const notificationData = JSON.parse(message.data.data)
    Object.keys(notificationData).forEach(key => {
        if (notificationData[key] === null) {
          delete notificationData[key];
        }
        else{
            notificationData[key] = String(notificationData[key]);
        }
    });
    onDisplayNotification(message.data.title, message.data.body, notificationData);
}