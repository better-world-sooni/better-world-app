import React from 'react';
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
}) {
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
          h40
          py0
          px10
          rounded100
          placeholder={'메세지를 전송해요.'}
          value={text}
          mt={0}
          onChangeText={onTextChange}
          rightComp={
            <Div
              flex
              justifyCenter
              pl10
              onPress={!roomLoading && text && onPressSend}>
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
