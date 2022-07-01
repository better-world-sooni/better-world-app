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
    if( data.unread_notification_count + data.unread_message_count >= 0) {
        notifee.setBadgeCount(data.unread_notification_count + data.unread_message_count);
    } 
    console.log(navigationRef.getCurrentRoute()) 
    if (data.event === 'chat') {
        notifee.displayNotification({
            title,
            body: "GOMZ #4: Hi There!",
            android: {
                channelId,
                timestamp: Date.now(),
                showTimestamp: true,
                pressAction: {
                    id: 'default',
                },
                largeIcon: 'https://d6d3sarhyklmq.cloudfront.net/nft/image/0xe5e47d1540d136777c0b4e0865f467987c3d6513/1.png'
            },
            data
        });
    }
    else {
        notifee.displayNotification({
            title,
            subtitle: "hihi",
            body: "GOMZ #4: Hi There!",
            android: {
                channelId,
                timestamp: Date.now(),
                showTimestamp: true,
                pressAction: {
                    id: 'default',
                },
                largeIcon: 'https://d6d3sarhyklmq.cloudfront.net/nft/image/0xe5e47d1540d136777c0b4e0865f467987c3d6513/1.png'
            },
            data
        });
        // notifee.displayNotification({
        //     title,
        //     body,
        //     android: {
        //         channelId,
        //         pressAction: {
        //             id: 'default',
        //         },
        //     },
        //     data
        // });
    }
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