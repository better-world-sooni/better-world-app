import AsyncStorage from '@react-native-async-storage/async-storage';
import { Manager } from 'socket.io-client';
import { JWT_TOKEN } from 'src/modules/constants';

const BACKEND_URL = 'http://localhost:8000/';
export const manager = new Manager(BACKEND_URL, {
    reconnectionDelayMax: 5000,
});