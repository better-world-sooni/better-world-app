import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {mergePropsWithStyleComp} from 'src/modules/viewComponents';
import {
  addBackgroundStyles,
  addBorderStyles,
  addLayoutStyles,
  addStyles,
  addTextStyles,
} from 'src/modules/styleUtils';

const getTextStyles = props => {
  const {style} = props;
  let arr = [];
  Object.keys(props).forEach(key => {
    if (props[key]) {
      addLayoutStyles(props, arr, key);
      addBackgroundStyles(props, arr, key);
      addBorderStyles(props, arr, key);
      addTextStyles(props, arr, key);
    }
  });
  addStyles(arr, style);
  return arr;
};

export const Span = props => {
  const {innerRef} = props;
  const mergedProps = mergePropsWithStyleComp(props);
  const textStyles = getTextStyles(mergedProps);
  const sheet = StyleSheet.create({
    style: StyleSheet.flatten(textStyles),
  });
  return (
    //NotoSansKR-Regular
    <Text
      ref={innerRef}
      {...mergedProps}
      style={[
        {
          // fontFamily: 'UniSans',
          color: 'black',
          fontSize: 13,
          flexDirection: 'row',
          flexWrap: 'wrap',
        },
        sheet.style,
      ]}>
      {props.children}
    </Text>
  );
};
