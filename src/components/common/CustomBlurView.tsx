import React from 'react';
import { Platform } from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {Div} from './Div';
import {Img} from './Img';
import BackdropFilter from "react-backdrop-filter";
import { StyleSheet, Text, View } from 'react-native';


export const CustomBlurView = props => {
    const {
        blurType,
        blurAmount,
        blurRadius,
        style,
        reducedTransparencyFallbackColor,
    } = props;

    return (
        (Platform.OS === 'ios' ?
        <BlurView
            blurType={blurType}
            blurAmount={blurAmount}
            blurRadius={blurRadius}
            style={style}
            reducedTransparencyFallbackColor={reducedTransparencyFallbackColor}
        ></BlurView>
        : 
        <Img
            tintColor={'gray'}
            opacity={0}
        ></Img>
        )
    )
}