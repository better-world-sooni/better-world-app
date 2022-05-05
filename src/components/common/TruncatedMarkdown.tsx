import React from 'react';
import Markdown from 'react-native-markdown-display';
import {Div} from './Div';

type TruncatedMarkdownProps = {
  text: string;
  maxLength: number;
  onPressTruncated?: any;
};
type TruncatedMarkdownType = (props: TruncatedMarkdownProps) => JSX.Element;

const TruncatedMarkdown: TruncatedMarkdownType = function ({
  text,
  maxLength,
  onPressTruncated = null,
}) {
  const lines = text.split('\n');
  let lineLength = 0;
  const resultLines = [];
  for (const lineIndex in lines) {
    if (lineLength + lines[lineIndex].length > maxLength) {
      const words = lines[lineIndex].split(' ');
      let truncatedLine = '';
      for (const wordIndex in words) {
        if (
          lineLength + truncatedLine.length + words[wordIndex].length >
          maxLength
        ) {
          break;
        }
        truncatedLine = truncatedLine.concat(' ', words[wordIndex]);
      }
      if (truncatedLine) {
        resultLines.push(truncatedLine);
      }
      break;
    }
    lineLength += lines[lineIndex].length;
    resultLines.push(lines[lineIndex]);
  }
  const result = resultLines.join('\n');
  if (result.length != text.length) {
    if (onPressTruncated) {
      return (
        <Div onPress={onPressTruncated} cursorPointer>
          <Markdown children={result.concat('... 더보기')} />
        </Div>
      );
    }
    return <Markdown children={result.concat('...')} />;
  }
  return <Markdown style={{body: {marginTop: -20}}} children={result} />;
};

export default TruncatedMarkdown;
