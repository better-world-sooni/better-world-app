import React from 'react';
import {GRAY_COLOR} from 'src/modules/constants';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';

const FeedChecked = () => {
  return (
    <Row pb20>
      <Col></Col>
      <Col auto>
        <Span color={GRAY_COLOR}>오늘의 피드를 모두 확인했습니다.</Span>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default FeedChecked;
