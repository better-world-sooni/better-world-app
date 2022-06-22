import React from 'react';
import { Platform } from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {Div} from './Div';
import {Img} from './Img';
import {StyleSheet, Text, View} from 'react-native';

export const CustomBlurView = props => {
  const {
    blurType,
    blurAmount,
    blurRadius,
    style,
    overlayColor,
    reducedTransparencyFallbackColor,
  } = props;

  return Platform.OS === 'ios' ? (
    <BlurView
      blurType={blurType}
      blurAmount={blurAmount}
      blurRadius={blurRadius}
      style={style}
      overlayColor={overlayColor}
      reducedTransparencyFallbackColor={
        reducedTransparencyFallbackColor
      }></BlurView>
  ) : (
    <Div style={style} bgWhite opacity={0.8}></Div>
  );
};