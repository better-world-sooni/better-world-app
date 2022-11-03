import React from 'react';
import Markdown from 'react-native-markdown-display';

export default function DefaultMarkdown(props) {
  const commonProps = {};
  const styles = {
    body: {
      fontSize: 15,
      ...commonProps,
    },
    paragraph: {
      fontSize: 15,
      ...commonProps,
    },
    heading1: {
      fontSize: 19,
      fontWeight: '700',
      ...commonProps,
    },
    heading2: {
      fontSize: 18,
      fontWeight: '600',
      ...commonProps,
    },
    heading3: {
      fontSize: 17,
      fontWeight: '500',
      ...commonProps,
    },
    heading4: {
      fontSize: 16,
      fontWeight: '500',
      ...commonProps,
    },
    heading5: {
      fontSize: 15,
      fontWeight: '500',
      ...commonProps,
    },
    heading6: {
      fontSize: 14,
      fontWeight: '500',
      ...commonProps,
    },
  };
  return <Markdown style={styles} {...props} />;
}
