import AsyncStorage from '@react-native-async-storage/async-storage';
import { Manager } from 'socket.io-client';
import { JWT_TOKEN } from 'src/modules/constants';

const BACKEND_URL = 'http://localhost:8000/';
const manager = new Manager(BACKEND_URL, {
    reconnectionDelayMax: 5000,
    query: {
        entity: "app",
    },
});
export const chatSocket = manager.socket('/chat', {
    auth: {
        token: AsyncStorage.getItem(JWT_TOKEN)
    },
});
export const metasunganListener = manager.socket('/metasungan', {
    auth: {
        token: AsyncStorage.getItem(JWT_TOKEN)
    },
});
