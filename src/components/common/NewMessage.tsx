import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {X} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {varStyle} from 'src/modules/styles';
import {usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {TextField} from '../TextField';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

export enum ReplyToType {
  Comment = 'Comment',
  Post = 'Post',
}

export default function NewMessage({text, onTextChange, onPressSend}) {
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
            <Div ml10 onPress={text && onPressSend}>
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
