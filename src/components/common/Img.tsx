import React from 'react';
import {StyleSheet} from 'react-native';
import {
  addBackgroundStyles,
  addBorderStyles,
  addImageStyles,
  addLayoutStyles,
  addStyles,
} from 'src/modules/styleUtils';
import {mergePropsWithStyleComp} from 'src/modules/viewComponents';
import FastImage from 'react-native-fast-image';

const getImageStyles = props => {
  const {style} = props;
  let arr = [];
  Object.keys(props).forEach(key => {
    if (props[key]) {
      addLayoutStyles(props, arr, key);
      addBackgroundStyles(props, arr, key);
      addBorderStyles(props, arr, key);
      addImageStyles(props, arr, key);
    }
  });
  addStyles(arr, style);
  return arr;
};

export const Img = props => {
  const {innerRef, uri, cache, source, a_source, isActive} = props;
  const mergedProps = mergePropsWithStyleComp(props);
  const imageStyles = getImageStyles(mergedProps);
  const sheet = StyleSheet.create({
    style: StyleSheet.flatten(imageStyles),
  });
  const s = uri
    ? {
        uri: uri,
        cache: cache,
      }
    : isActive
    ? a_source
    : source;
  return (
    <FastImage ref={innerRef} {...mergedProps} style={sheet.style} source={s} />
  );
};
