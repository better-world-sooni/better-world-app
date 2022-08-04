import React, {useState} from 'react';
import {varStyle} from 'src/modules/styles';
import {TextField} from '../TextField';
import {Div} from './Div';
import {Span} from './Span';

export enum ReplyToType {
  Comment = 'Comment',
  Post = 'Post',
}

export default function NewMessage({
  text,
  onTextChange,
  onPressSend,
  roomLoading,
  ready
}) {
  const [textHeight, setTextHeight] = useState(33)

  return (
    <Div
      zIndex={100}
      bgWhite
      w={'100%'}
      borderTop={0.5}
      borderColor={varStyle.gray200}>
      <Div px15 py8>
        <TextField
          w={'100%'}
          h={textHeight}
          py0
          px10
          placeholder={'메세지를 전송해요.'}
          value={text}
          mt={0}
          pt={8}
          onChangeText={onTextChange}
          onContentSizeChange={event => {
            if (event.nativeEvent.contentSize.height > 33)
              setTextHeight(event.nativeEvent.contentSize.height);
            else setTextHeight(33);
          }}
          newLineButton={false}
          rightComp={
            <Div
              flex
              justifyCenter
              pl10
              onPress={!roomLoading && ready && text && onPressSend}>
              <Span medium fontSize={14} primary={text} gray400={!text}>
                전송
              </Span>
            </Div>
          }
          autoCapitalize="none"
        />
      </Div>
    </Div>
  );
}
