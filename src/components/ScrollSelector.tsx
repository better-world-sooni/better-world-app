import React from 'react';
import {Picker} from '@react-native-picker/picker';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {GO_COLOR, GRAY_COLOR} from 'src/modules/constants';

export const ScrollSelector = ({
  selectedValue,
  onValueChange,
  options,
  onClose,
}) => {
  return (
    <Div borderTopColor={GRAY_COLOR} borderTopWidth={0.5}>
      <Row bg={'white'}>
        <Col></Col>
        <Col auto px20 py10 onPress={() => onClose()}>
          <Span color={GO_COLOR}>완료</Span>
        </Col>
      </Row>
      <Picker
        selectedValue={selectedValue}
        onValueChange={itemValue => onValueChange(itemValue)}>
        {options.map((item, index) => {
          return <Picker.Item label={item} value={item} key={index} />;
        })}
      </Picker>
    </Div>
  );
};
