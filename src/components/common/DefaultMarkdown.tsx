import React from 'react';
import Markdown from 'react-native-markdown-display';

export default function DefaultMarkdown(props) {
  const commonProps = {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  };
  const styles = {
    body: {
      marginTop: 0,
      marginBottom: 0,
      fontSize: 14,
      ...commonProps,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 0,
      ...commonProps,
    },
    heading1: {
      fontSize: 19,
      marginBottom: 5,
      fontWeight: '700',
      ...commonProps,
    },
    heading2: {
      fontSize: 18,
      marginBottom: 5,
      fontWeight: '600',
      ...commonProps,
    },
    heading3: {
      fontSize: 17,
      marginBottom: 5,
      fontWeight: '500',
      ...commonProps,
    },
    heading4: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: '500',
      ...commonProps,
    },
    heading5: {
      fontSize: 15,
      marginBottom: 5,
      fontWeight: '500',
      ...commonProps,
    },
    heading6: {
      fontSize: 14,
      marginBottom: 5,
      fontWeight: '500',
      ...commonProps,
    },
  };
  return <Markdown style={styles} {...props} />;
}
