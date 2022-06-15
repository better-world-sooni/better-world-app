import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {BETTER_WORLD_MAIN_PUSH_CHANNEL} from 'src/modules/constants';
import messaging from '@react-native-firebase/messaging';

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
    const dataJSONWithStrings = JSON.parse(message.data.data, (key, val) => (
        typeof val !== 'object' && val !== null ? String(val) : val
    ));
    onDisplayNotification(message.data.title, message.data.body, dataJSONWithStrings);
}