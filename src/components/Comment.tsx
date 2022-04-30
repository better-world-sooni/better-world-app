import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Heart} from 'react-native-feather';
import {
  APPLE_RED,
  GRAY_COLOR,
  HEART_COLOR,
  kmoment,
  PLACE,
  SUNGAN,
} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {Swipeable} from 'react-native-gesture-handler';
import {deletePromiseFn} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {isOkay} from 'src/modules/utils';
import {Alert} from 'react-native';

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
  postType,
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
}) => {
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [deleted, setDeleted] = useState(false);
  const deleteCommentUrl = useMemo(() => {
    if (postType == SUNGAN) {
      return apis.post.sungan.comment.delete(commentId).url;
    }
    if (postType == PLACE) {
      return apis.post.place.comment.delete(commentId).url;
    }
    return apis.post.report.comment.delete(commentId).url;
  }, [commentId, postType]);
  const deleteComment = useCallback(async () => {
    const res = await deletePromiseFn({
      url: deleteCommentUrl,
      body: {},
      token: token,
    });
    if (isOkay(res)) {
      setDeleted(true);
      Alert.alert('댓글을 성공적으로 지웠습니다.');
    } else {
      Alert.alert('댓글을 지우는데 문제가 발생하였습니다.');
    }
  }, [deleteCommentUrl, token]);
  useEffect(() => {
    setDeleted(false);
  }, [postType, commentId]);
  if (deleted) {
    return null;
  }
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
                  <Span color={GRAY_COLOR}>
                    {kmoment(createdAt).calendar()}
                  </Span>
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
              <Span color={GRAY_COLOR}>{kmoment(createdAt).calendar()}</Span>
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
