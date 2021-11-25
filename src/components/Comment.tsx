import React from 'react';
import {Heart} from 'react-native-feather';
import {APPLE_RED, GRAY_COLOR, HEART_COLOR} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import moment from 'moment';
import 'moment/locale/ko';
import {Swipeable} from 'react-native-gesture-handler';
moment.locale('ko');

const RightSwipeActions = () => {
  return (
    <Div flex={1} bg={APPLE_RED} justifyCenter itemsEnd>
      <Span color={'white'} px20 medium>
        댓글 지우기
      </Span>
    </Div>
  );
};

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
  mine = false,
  deleteComment = null,
}) => {
  if (mine) {
    return (
      <Swipeable
        renderRightActions={RightSwipeActions}
        onSwipeableRightOpen={deleteComment}>
        <Div py10 px20 bg={'white'}>
          <Row itemsCenter justifyCenter flex>
            <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
              <Img
                source={
                  IMAGES.characters[userProfileImgUrl] ||
                  IMAGES.imageProfileNull
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
                  onPress={() =>
                    handleReplyOnComment({id: commentId, userName})
                  }>
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
      </Swipeable>
    );
  }
  return (
    <Div py10 px20>
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
