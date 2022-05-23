import React from 'react';
import Markdown from 'react-native-markdown-display';

export default function DefaultMarkdown(props) {
  return (
    <Markdown
      style={{
        body: {marginTop: 0, marginBottom: 0, fontSize: 14},
        paragraph: {
          marginTop: 0,
          marginBottom: 0,
        },
        heading1: {
          fontSize: 19,
          marginBottom: 5,
        },
        heading2: {
          fontSize: 18,
          marginBottom: 5,
        },
        heading3: {
          fontSize: 17,
          marginBottom: 5,
        },
        heading4: {
          fontSize: 16,
          marginBottom: 5,
        },
        heading5: {
          fontSize: 15,
          marginBottom: 5,
        },
        heading6: {
          fontSize: 14,
          marginBottom: 5,
        },
      }}
      {...props}
    />
  );
}
