import React from 'react';
import {StyleSheet} from 'react-native';
import {Div} from 'src/components/common/Div';

export const Col = props => {
  const {w, size, style, auto, innerRef} = props;
  const flattenedStyle = StyleSheet.flatten(style);
  const existWidth = w || (flattenedStyle && flattenedStyle.width);
  return (
    <Div
      innerRef={innerRef}
      extraStyle={[
        {
          flexDirection: 'column',
        },
        (existWidth || size || !auto) && {
          flex: size ? size : existWidth ? 0 : 1,
        },
      ]}
      {...props}>
      {props.children}
    </Div>
  );
};
