import React from 'react';
import {Heart} from 'react-native-feather';
import {GRAY_COLOR, iconSettings} from 'src/modules/constants';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';

const borderBottomProp = {
  borderBottomColor: GRAY_COLOR,
  borderBottomWidth: 0.3,
};
const PostDetailHeader = ({
  emoji,
  place,
  text,
  likeCnt,
  didLike,
  handleLike,
}) => {
  console.log('PostDetailHeader');
  return (
    <>
      <Div itemsCenter justifyCenter>
        <Span fontSize={100}>{emoji}</Span>
      </Div>
      {place && (
        <Div itemsCenter justifyCenter px20 py10>
          <Span bold>{place}</Span>
        </Div>
      )}
      <Div itemsCenter justifyCenter px20>
        <Span>{text}</Span>
      </Div>
      <Row itemsCenter pt10 pb10 px20 {...borderBottomProp}>
        <Col auto>
          <Row>
            <Span medium>{`좋아요 ${likeCnt}개`}</Span>
          </Row>
        </Col>
        <Col></Col>
        <Col auto>
          <Row>
            <Col auto px5 onPress={handleLike}>
              <Heart {...iconSettings} fill={didLike ? 'red' : 'white'}></Heart>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default React.memo(PostDetailHeader);
