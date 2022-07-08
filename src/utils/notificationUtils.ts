import notifee, { AndroidImportance, AndroidStyle  } from '@notifee/react-native';
import { createNavigationContainerRef } from '@react-navigation/native';
import { updateNotificationCountEvent } from 'App';
import { EventRegister } from 'react-native-event-listeners';
import {BETTER_WORLD_MAIN_PUSH_CHANNEL} from 'src/modules/constants';

export const navigationRef = createNavigationContainerRef()

export function notificationNavigate(name, params?) {
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
    const unreadNotificationCount = parseInt(data.unread_notification_count)
    const unreadChatRoomCount = parseInt(data.unread_message_count)
    EventRegister.emit(updateNotificationCountEvent(), {unreadNotificationCount, unreadChatRoomCount})
    if (data.event === 'chat') {
        if(!navigationRef.isReady() || navigationRef.getCurrentRoute().name != 'ChatList' && 
        (navigationRef.getCurrentRoute().name != 'ChatRoom' || 
            (navigationRef.getCurrentRoute().params["opponentNft"].token_id != data.token_id ||
            navigationRef.getCurrentRoute().params["opponentNft"].contract_address != data.contract_address)
        )) {
            notifee.displayNotification({
                id: data.room_id,
                title,
                body: `${data.name || data.meta_name}: ${body}`,
                android: {
                    channelId,
                    style: {
                        type: AndroidStyle.MESSAGING,
                        person: {
                            name: data.name || data.meta_name,
                            icon: data.image_uri || data.meta_image_uri,
                        },
                        messages: [{
                            text: body,
                            timestamp: Date.parse(data.timestamp),
                        }],
                    },
                    timestamp: Date.parse(data.timestamp),
                    showTimestamp: true,
                    pressAction: {
                        id: 'default',
                    }
                },
                data
            });
        }
    }
    else {
        notifee.displayNotification({
            title,
            body,
            android: {
                channelId,
                timestamp: Date.now(),
                showTimestamp: true,
                pressAction: {
                    id: 'default',
                },
            },
            data
        });
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