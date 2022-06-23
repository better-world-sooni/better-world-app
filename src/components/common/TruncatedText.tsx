import {Span} from './Span';
import React from 'react';

type TruncatedTextProps = {
  text: string;
  maxLength: number;
  maxLines: number;
  onPressTruncated?: any;
  spanProps?: any;
};
type TruncatedTextType = (props: TruncatedTextProps) => JSX.Element;

const TruncatedText: TruncatedTextType = function ({
  text,
  maxLength,
  maxLines = 8,
  onPressTruncated = null,
  spanProps = {},
}) {
  if (!text) return null;
  const lines = text.split('\n').slice(0, maxLines);
  let stringLength = 0;
  const resultLines = [];
  for (const lineIndex in lines) {
    if (stringLength + lines[lineIndex].length > maxLength) {
      const words = lines[lineIndex].split(' ');
      let truncatedLine = '';
      for (const wordIndex in words) {
        if (
          stringLength + truncatedLine.length + words[wordIndex].length >
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
    stringLength += lines[lineIndex].length;
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
