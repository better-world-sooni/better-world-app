import moment from 'moment';
import React from 'react';
import {GRAY_COLOR} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {Col} from './common/Col';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import 'moment/locale/ko';
moment.locale('ko');

const NestedComment = ({userProfileImgUrl, userName, content, createdAt}) => {
  return (
    <Row itemsCenter justifyCenter flex ml30 pt10 pl10>
      <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
        <Img
          source={
            IMAGES.characters[userProfileImgUrl] || IMAGES.imageProfileNull
          }
          w20
          h20></Img>
      </Col>
      <Col>
        <Row mb5 pl10>
          <Col mr10 justifyCenter>
            <Span medium>{`${userName}  ${content}`}</Span>
          </Col>
        </Row>
        <Row pl10>
          <Col auto mr10>
            <Span color={GRAY_COLOR} fontSize={12}>
              {moment(createdAt).calendar()}
            </Span>
          </Col>
          <Col></Col>
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(NestedComment);
