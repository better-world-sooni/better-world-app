import React from 'react';
import {IMAGES} from 'src/modules/images';
import {Col} from './common/Col';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';

const BestComment = ({userProfileImgUrl, userName, content, onPress}) => {
  return (
    <Row itemsCenter justifyCenter pb10 pt5 flex onPress={onPress}>
      <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
        <Img
          source={
            IMAGES.characters[userProfileImgUrl] || IMAGES.imageProfileNull
          }
          w15
          h15></Img>
      </Col>
      <Col mx10 justifyCenter>
        <Row>
          <Span medium color={'black'}>
            {`${userName} ${content}`}
          </Span>
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(BestComment);
