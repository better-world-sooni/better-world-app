import React from 'react';
import Markdown from 'react-native-markdown-display';

export const DefaultMarkdown = props => {
  const {style, ...commonProps} = props;
  const {fontSize, ...commonStyles} = style ? style : {fontSize: 15};
  const styles = {
    body: {
      fontSize: fontSize,
      ...commonStyles,
    },
    paragraph: {
      fontSize: fontSize,
      ...commonStyles,
    },
    heading1: {
      fontSize: fontSize + 4,
      fontWeight: '700',
      ...commonStyles,
    },
    heading2: {
      fontSize: fontSize + 3,
      fontWeight: '600',
      ...commonStyles,
    },
    heading3: {
      fontSize: fontSize + 2,
      fontWeight: '500',
      ...commonStyles,
    },
    heading4: {
      fontSize: fontSize + 1,
      fontWeight: '500',
      ...commonStyles,
    },
    heading5: {
      fontSize: fontSize,
      fontWeight: '500',
      ...commonStyles,
    },
    heading6: {
      fontSize: fontSize - 1,
      fontWeight: '500',
      ...commonStyles,
    },
  };
  return <Markdown {...commonProps} style={styles} />;
};

export default DefaultMarkdown;
