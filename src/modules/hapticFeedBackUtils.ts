import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

export function largeBump(){
    ReactNativeHapticFeedback.trigger('impactHeavy', options);
}

export function mediumBump(){
    ReactNativeHapticFeedback.trigger('impactMedium', options);
}

export function smallBump(){
    ReactNativeHapticFeedback.trigger('impactLight', options);
}