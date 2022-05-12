import React from 'react';
import Markdown from 'react-native-markdown-display';

export default function DefaultMarkdown(props) {
  return (
    <Markdown
      style={{
        body: {marginTop: 0, marginBottom: 0, fontSize: 14},
        heading1: {fontSize: 19, fontWeight: '600'},
        heading2: {fontSize: 18, fontWeight: '600'},
        heading3: {fontSize: 17, fontWeight: '600'},
        heading4: {fontSize: 16, fontWeight: '500'},
        heading5: {fontSize: 15, fontWeight: '500'},
        heading6: {fontSize: 14, fontWeight: '500'},
      }}
      {...props}
    />
  );
}
