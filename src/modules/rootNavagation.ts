import * as React from 'react';
import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function notificationNavigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params as never);
    } 
    else {
        console.log("navigation not ready")
    }
}