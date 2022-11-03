import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {Linking} from 'react-native';
import {CheckCircle, Info, Minus, Plus, X} from 'react-native-feather';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import GradientColorRect from 'src/components/common/GradientColorRect';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';

export default function UgcConfirmationScreen({
  route: {
    params: {onConfirm},
  },
}) {
  const {goBack} = useNavigation();
  const handleConfirm = async () => {
    goBack();
    onConfirm();
  };
  const handlePressLink = () => {
    Linking.openURL(
      'https://soonilabs.notion.site/BetterWorld-0be09079f3694e609601d6708e5a1e2d',
    );
  };
  return (
    <Div flex={1} itemsCenter justifyCenter backgroundColor="rgba(0,0,0,0.2)">
      <Div
        bgWhite
        rounded10
        w={DEVICE_WIDTH - 100}
        px15
        py15
        border={0.5}
        borderGray200>
        <Div itemsCenter px12 py8>
          <Span
            fontSize={18}
            style={{textAlign: 'center'}}
            lineHeight={26}
            bold>
            BetterWorld{' '}
            <Span underline bold fontSize={18} onPress={handlePressLink}>
              이용약관
            </Span>
            에 동의한 후 앱을 사용하실 수 있습니다.
          </Span>
        </Div>
        <Div itemsCenter></Div>
        <Row
          h48
          mt12
          border={0.5}
          borderGray200
          p12
          itemsCenter
          justifyCenter
          rounded10
          overflowHidden
          relative
          onPress={handleConfirm}>
          <Col></Col>
          <Col auto>
            <Span bold>동의하기</Span>
          </Col>
          <Col></Col>
        </Row>
      </Div>
    </Div>
  );
}
