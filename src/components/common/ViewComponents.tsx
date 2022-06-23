import React from 'react';
import {
  TextInput as TextInputOriginal,
  TouchableHighlight as TouchableHighlightOriginal,
  View as ViewOriginal,
  KeyboardAvoidingView as KeyboardAvoidingViewOriginal,
  TouchableOpacity as TouchableOpacityOriginal,
  ScrollView as ScrollViewOriginal,
  FlatList as FlatListOriginal,
  ImageBackground as ImageBackgroundOriginal,
} from 'react-native';
import {
  addBackgroundStyles,
  addBorderStyles,
  addLayoutStyles,
  addStyles,
} from 'src/utils/styleUtils';
import * as _ from 'lodash';
import {StyleSheet} from 'react-native';

const getPropsIfActive = comp => {
  if (!comp.props) {
    return {};
  }
  if (_.has(comp.props, 'isActive')) {
    const {isActive, ...propsWihoutIsActive} = comp.props;
    return comp.props.isActive ? propsWihoutIsActive : {};
  }
  return {...comp.props};
};

export const mergePropsWithStyleComp = props => {
  const {styleComp} = props;
  if (!styleComp) {
    return {...props};
  }
  if (_.isArray(styleComp)) {
    let retProps = {};
    const styleArr = styleComp.map(comp => {
      if (!comp) {
        return;
      }
      const propsIfActive = getPropsIfActive(comp);
      retProps = {...retProps, ...propsIfActive};
      return StyleSheet.flatten(propsIfActive.style);
    });
    return {
      ...props,
      ...retProps,
      style: [...styleArr, StyleSheet.flatten(props.style)],
    };
  }
  const propsIfActive = getPropsIfActive(styleComp);
  return {
    ...props,
    ...propsIfActive,
    style: [
      StyleSheet.flatten(propsIfActive.style),
      StyleSheet.flatten(props.style),
    ],
  };
};

const getViewStyles = props => {
  const {style, extraStyle} = props;
  let viewStyles = [];
  Object.keys(props).forEach(key => {
    if (props[key]) {
      addLayoutStyles(props, viewStyles, key);
      addBorderStyles(props, viewStyles, key);
      addBackgroundStyles(props, viewStyles, key);
    }
  });
  addStyles(viewStyles, extraStyle);
  addStyles(viewStyles, style);
  return viewStyles;
};

export const withViewStyle = (Component, defaultProps?) => props => {
  const {innerRef, ...others} = props;
  const viewStyles = getViewStyles(mergePropsWithStyleComp(others));
  return (
    <Component ref={innerRef} {...defaultProps} {...props} style={viewStyles} />
  );
};

export const TouchableOpacity = withViewStyle(TouchableOpacityOriginal);
export const TouchableHighlight = withViewStyle(TouchableHighlightOriginal);
export const TextInput = withViewStyle(TextInputOriginal);
export const View = withViewStyle(ViewOriginal);
export const KeyboardAvoidingView = withViewStyle(KeyboardAvoidingViewOriginal);
export const ScrollView = withViewStyle(ScrollViewOriginal, {
  scrollIndicatorInsets: {right: 1},
});
export const FlatList = withViewStyle(FlatListOriginal, {
  scrollIndicatorInsets: {right: 1},
});
export const ImageBackground = withViewStyle(ImageBackgroundOriginal);
