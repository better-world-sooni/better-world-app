import React from 'react';
import {Heart} from 'react-native-feather';
import {GRAY_COLOR, HEART_COLOR} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import moment from 'moment';
import 'moment/locale/ko';
moment.locale('ko');

const Comment = ({
  createdAt,
  commentId,
  userName,
  content,
  userProfileImgUrl,
  likeCnt,
  isLiked,
  handleLikeOnComment,
  handleReplyOnComment,
  children = null,
}) => {
  return (
    <Div pt20 px20>
      <Row itemsCenter justifyCenter flex>
        <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
          <Img
            source={
              IMAGES.characters[userProfileImgUrl] || IMAGES.imageProfileNull
            }
            w30
            h30></Img>
        </Col>
        <Col>
          <Row mb5 pl10>
            <Span medium>{`${userName}  ${content}`}</Span>
          </Row>
          <Row pl10>
            <Col mr10 auto>
              <Span color={GRAY_COLOR}>{moment(createdAt).calendar()}</Span>
            </Col>
            {likeCnt > 0 && (
              <Col mr10 auto>
                <Span color={GRAY_COLOR}>{`좋아요 ${likeCnt}개`}</Span>
              </Col>
            )}
            <Col
              auto
              onPress={() => handleReplyOnComment({id: commentId, userName})}>
              <Span color={GRAY_COLOR}>답글 달기</Span>
            </Col>
            <Col></Col>
          </Row>
        </Col>
        <Col
          auto
          itemsCenter
          justifyCenter
          onPress={() => handleLikeOnComment(commentId, isLiked)}>
          <Heart
            strokeWidth={isLiked ? 0 : 1.3}
            fill={isLiked ? HEART_COLOR : 'white'}
            color={'black'}
            height={14}></Heart>
        </Col>
      </Row>
      {children}
    </Div>
  );
};
export default React.memo(Comment);
