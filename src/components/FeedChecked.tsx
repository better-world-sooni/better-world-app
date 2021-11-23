import React from 'react';
import {CheckCircle} from 'react-native-feather';
import {GRAY_COLOR} from 'src/modules/constants';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';

const FeedChecked = () => {
  return (
    <>
      <Row itemsCenter justifyCenter pt20 pb10>
        <Col h2 bg={GRAY_COLOR} />
        <Col auto>
          <CheckCircle
            height={50}
            width={50}
            strokeWidth={0.7}
            color={GRAY_COLOR}></CheckCircle>
        </Col>
        <Col h2 bg={GRAY_COLOR}></Col>
      </Row>
      <Row pb20>
        <Col></Col>
        <Col auto>
          <Span color={GRAY_COLOR}>오늘의 피드를 모두 확인했습니다.</Span>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
};

export default FeedChecked;
