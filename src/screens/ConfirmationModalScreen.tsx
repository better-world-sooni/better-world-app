import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {DEVICE_WIDTH} from 'src/modules/styles';

export default function ConfirmationModalScreen({
  route: {
    params: {onCancel = null, onConfirm = null, text},
  },
}) {
  const {goBack} = useNavigation();
  const handleCancel = async () => {
    if (onCancel) await onCancel();
    goBack();
  };
  const handleConfirm = async () => {
    if (onConfirm) await onConfirm();
    goBack();
  };
  return (
    <Div flex={1} itemsCenter justifyCenter backgroundColor="rgba(0,0,0,0.2)">
      <Div
        bgWhite
        rounded10
        w={DEVICE_WIDTH - 60}
        px15
        py8
        border={0.5}
        borderGray200>
        <Div itemsCenter px12 py8>
          <Span
            bold
            fontSize={18}
            style={{textAlign: 'center'}}
            lineHeight={26}>
            {text}
          </Span>
        </Div>
        <Row py8>
          <Col
            border={0.5}
            borderGray200
            p12
            itemsCenter
            rounded100
            mr4
            onPress={handleCancel}>
            <Span bold>취소</Span>
          </Col>
          <Col bgBlack p12 itemsCenter rounded100 ml4 onPress={handleConfirm}>
            <Span bold white>
              확인
            </Span>
          </Col>
        </Row>
      </Div>
    </Div>
  );
}
