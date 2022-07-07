import React from 'react';
import {TouchableOpacity, View} from './ViewComponents';

export const Div = props => {
  const {onPress, ...otherProps} = props;
  return onPress ? (
    <TouchableOpacity {...otherProps} onPress={onPress}>
      {props.children}
    </TouchableOpacity>
  ) : (
    <View {...otherProps}>{props.children}</View>
  );
};
