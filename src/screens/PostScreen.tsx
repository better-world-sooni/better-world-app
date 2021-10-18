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
  const scrollRef = useRef(null);

  return (
    <Div flex>
      <NativeBaseProvider>
        <TopHeader
          route={useNavigation}
          title={'새 게시물'}
          headerColor={'white'}
        />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: 'white'}}>
          <Div>
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
                  onFocus={event => {
                    scrollRef.current.scrollTo({
                      x: 0,
                      y: 100,
                      animated: true,
                    });
                  }}
                  w={'100%'}
                  h={200}
                  textContentType={'none'}
                  numberOfLines={20}
                  placeholder={''}></TextArea>
              </Row>
              <Row mb5 mt15>
                <Span medium fontSize={20}>
                  교통수단
                </Span>
              </Row>
              <Row my5 itemsCenter>
                <Col border h150 itemsCenter justifyCenter rounded5 mr5>
                  <Span medium fontSize={14}>
                    <FontAwesomeIcon
                      icon="subway"
                      color={'black'}></FontAwesomeIcon>{' '}
                    지하철
                  </Span>
                </Col>
                <Col border h150 itemsCenter justifyCenter rounded5 ml5>
                  <Span medium fontSize={14}>
                    <FontAwesomeIcon
                      icon="bus"
                      color={'black'}></FontAwesomeIcon>{' '}
                    버스
                  </Span>
                </Col>
              </Row>
              <Row mb5 mt15>
                <Span medium fontSize={20}>
                  호선
                </Span>
              </Row>
              <Row my5 itemsCenter>
                <ScrollView horizontal>
                  {[1, 2, 3, 4, 5, 6, 7].map(() => {
                    return (
                      <Div
                        h100
                        w100
                        itemsCenter
                        justifyCenter
                        rounded5
                        border
                        mr10>
                        <Span>1호선</Span>
                      </Div>
                    );
                  })}
                </ScrollView>
              </Row>
            </Div>
            <Div h={HAS_NOTCH ? 44 : 20} bg={'white'} />
          </Div>
        </ScrollView>
      </NativeBaseProvider>
    </Div>
  );
};

export default PostScreen;
