import React from 'react';
import { Picker } from 'react-native'
// import {Picker} from '@react-native-picker/picker';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {GO_COLOR, GRAY_COLOR} from 'src/modules/constants';

export const ScrollSelector = ({
  loading = null,
  selectedValue,
  onValueChange,
  options,
  onClose = null,
  onPressCenter = null,
}) => {
  return (
    <Div borderTopColor={GRAY_COLOR} borderTopWidth={0.5}>
      {!loading ? (
        <Row bg={'white'}>
          {onPressCenter && (
            <Col auto onPress={onPressCenter} px20 py10>
              <Span color={GO_COLOR}>기본길 가져오기</Span>
            </Col>
          )}
          <Col></Col>
          {onClose ? (
            <Col itemsEnd px20 py10 onPress={onClose}>
              <Span color={GO_COLOR}>완료</Span>
            </Col>
          ) : (
            <Col></Col>
          )}
        </Row>
      ) : (
        <Row>
          <Col />
          <Col auto px20 py10>
            <Span color={GO_COLOR}>로딩...</Span>
          </Col>
          <Col />
        </Row>
      )}
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
