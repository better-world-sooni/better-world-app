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
import {Square} from 'react-native-feather';

const ReportScreen = props => {
  const borderProp = which => {
    return which
      ? {
          borderBottomColor: 'gray',
          borderBottomWidth: 1.5,
        }
      : {
          borderBottomColor: 'rgb(199,199,204)',
          borderBottomWidth: 1.5,
        };
  };

  const iconSettings = {
    strokeWidth: 1.5,
    color: 'black',
    height: 20,
  };

  return (
    <Div flex>
      <NativeBaseProvider>
        <TopHeader
          route={useNavigation}
          title={'새 게시물'}
          headerColor={'white'}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: 'rgba(255,255,255,.9)'}}>
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
              <Row rounded20 mb10>
                <Col itemsCenter py10 {...borderProp(true)}>
                  <Span medium fontSize={15}>
                    요청
                  </Span>
                </Col>
                <Col itemsCenter py10>
                  <Span medium fontSize={15} color={'rgb(199,199,204)'}>
                    신고
                  </Span>
                </Col>
              </Row>
              <Row mb20>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['냉방/난방', '안내방송', '소음', '기타'].map(
                    (item, index) => {
                      return (
                        <Div
                          w100
                          h100
                          mr10
                          rounded
                          itemsCenter
                          justifyCenter
                          key={index}
                          style={{
                            borderWidth: 0.5,
                            borderColor: 'rgb(199,199,204)',
                          }}>
                          <Span color={'rgb(199,199,204)'}>{item}</Span>
                        </Div>
                      );
                    },
                  )}
                </ScrollView>
              </Row>
              <Row mb10 mt15>
                <Span medium fontSize={15}>
                  차량번호
                </Span>
              </Row>
              <Row my5 itemsCenter mb20>
                <Input
                  w={'100%'}
                  // {...borderProp(false)}
                  fontSize={13}
                  variant="unstyled"
                  textContentType={'none'}
                  numberOfLines={1}
                  placeholder={'탑승중: 322391'}></Input>
              </Row>
              <Row mb10 mt15>
                <Span medium fontSize={15}>
                  내용
                </Span>
              </Row>
              <Row mb20 itemsCenter>
                <Div
                  // borderWidth={1.5}
                  rounded
                  borderColor={'rgb(199,199,204)'}
                  w={'100%'}>
                  <TextArea
                    w={'100%'}
                    fontSize={13}
                    variant="unstyled"
                    textContentType={'none'}
                    numberOfLines={20}
                    placeholder={'9번칸 너무 추워요'}></TextArea>
                </Div>
              </Row>
              <Row mb5 mt15>
                <Col auto>
                  <Square {...iconSettings}></Square>
                </Col>
                <Col>
                  <Span medium fontSize={15}>
                    내용
                  </Span>
                </Col>
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
  