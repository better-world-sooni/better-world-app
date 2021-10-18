  import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
  import { Col } from 'src/components/common/Col';
  import { Div } from 'src/components/common/Div';
  import { Img } from 'src/components/common/Img';
  import { Row } from 'src/components/common/Row';
  import { Span } from 'src/components/common/Span';
  import APIS from 'src/modules/apis';
  import { IMAGES } from 'src/modules/images';
  import { NAV_NAMES } from 'src/modules/navNames';
  import {ScrollView, View} from 'src/modules/viewComponents';
import {Checkbox, Input, NativeBaseProvider, TextArea} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import TopHeader from 'src/components/TopHeader';
import {useNavigation} from '@react-navigation/core';
import {GO_COLOR} from 'src/modules/constants';

const ReportScreen = props => {
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
                <Span fontSize={100}>{'🚨'}</Span>
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
              <Row mb5 mt15>
                <Span medium fontSize={20}>
                  차량번호
                </Span>
              </Row>
              <Row my5 itemsCenter>
                <Input
                  onFocus={event => {
                    scrollRef.current.scrollTo({
                      x: 0,
                      y: 300,
                      animated: true,
                    });
                  }}
                  w={'100%'}
                  variant="underlined"
                  textContentType={'none'}
                  numberOfLines={1}
                  placeholder={'1242323'}></Input>
              </Row>
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
                      y: 400,
                      animated: true,
                    });
                  }}
                  w={'100%'}
                  h={300}
                  textContentType={'none'}
                  numberOfLines={20}
                  placeholder={'1242323'}></TextArea>
              </Row>
            </Div>
            <Div h200 />
          </Div>
        </ScrollView>
      </NativeBaseProvider>
    </Div>
  );
};
          
  export default ReportScreen;
  