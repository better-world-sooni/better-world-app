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
    reducedTransparencyFallbackColor,
  } = props;

  return Platform.OS === 'ios' ? (
    <BlurView
      blurType={blurType}
      blurAmount={blurAmount}
      blurRadius={blurRadius}
      style={style}
      reducedTransparencyFallbackColor={
        reducedTransparencyFallbackColor
      }></BlurView>
  ) : (
    <Div bgWhite opacity={0.9} {...props}></Div>
  );
};