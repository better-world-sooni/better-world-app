import {Span} from './Span';
import React from 'react';

type TruncatedTextProps = {
  text: string;
  maxLength: number;
  onPressTruncated?: any;
  spanProps?: any;
};
type TruncatedTextType = (props: TruncatedTextProps) => JSX.Element;

const TruncatedText: TruncatedTextType = function ({
  text,
  maxLength,
  onPressTruncated = null,
  spanProps = {},
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
        <Span onPress={onPressTruncated} {...spanProps}>
          {result.concat('...') + ' 더보기'}
        </Span>
      );
    }
    return <Span {...spanProps}>{result.concat('...')}</Span>;
  }
  return <Span {...spanProps}>{result}</Span>;
};

export default TruncatedText;
