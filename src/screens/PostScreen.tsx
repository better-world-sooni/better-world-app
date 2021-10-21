import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  Component,
} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {View} from 'src/modules/viewComponents';
import TopHeader from 'src/components/TopHeader';
import {useNavigation} from '@react-navigation/core';
import {
  Checkbox,
  Input,
  KeyboardAvoidingView,
  NativeBaseProvider,
  TextArea,
} from 'native-base';
import {GO_COLOR, HAS_NOTCH} from 'src/modules/constants';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ScrollView} from 'react-native';

const PostScreen = props => {
  return (
    <Div flex bgWhite>
      <NativeBaseProvider>
        <TopHeader
          route={useNavigation}
          title={'새 게시물'}
          headerColor={'white'}
        />
        <Div bgWhite>
          <Div py20 borderGray300>
            <Row justifyCenter>
              <Span fontSize={100}>{'🚆'}</Span>
            </Row>
            <Row justifyCenter>
              <Span medium color={GO_COLOR} fontSize={10}>
                {'첨부파일 변경'}
              </Span>
            </Row>
          </Div>
          <Div px20>
            <Row mb5 mt15>
              <Span medium fontSize={20}>
                내용
              </Span>
            </Row>
            <Row my5 itemsCenter>
              <TextArea
                w={'100%'}
                h={200}
                textContentType={'none'}
                numberOfLines={20}
                placeholder={''}></TextArea>
            </Row>
          </Div>
        </Div>
      </NativeBaseProvider>
    </Div>
  );
};

export default PostScreen;
