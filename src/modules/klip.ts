import { Platform } from "react-native"

export const bappName = 'BetterWorld'
export const PLATFORM = Platform.OS === 'ios' ?  'IOS-APP-BETTER-WORLD' : Platform.OS === 'android' ? 'ANDROID-APP-BETTER-WORLD' : 'APP-BETTER-WORLD'