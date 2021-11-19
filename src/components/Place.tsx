import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {Heart, MessageCircle} from 'react-native-feather';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {GRAY_COLOR, iconSettings, postShadowProp} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {NAV_NAMES} from 'src/modules/navNames';
import {isOkay, postKey} from 'src/modules/utils';
import {deletePromiseFn, postPromiseFn} from 'src/redux/asyncReducer';
import {setMainPost} from 'src/redux/feedReducer';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import moment from 'moment';
import 'moment/locale/ko';
moment.locale('ko');

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const Place = ({post, mine = null}) => {
  const {
    app: {
      session: {token},
    },
  } = useSelector((root: RootState) => root, shallowEqual);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const sungan = post.post;
  const bestComment = post.bestComment;
  const like = useCallback(() => {
    if (post.didLike) {
      const {
        didLike,
        post: {likeCnt, ...otherProps},
        ...other
      } = post;
      ReactNativeHapticFeedback.trigger('impactLight', options);
      dispatch(
        setMainPost({
          didLike: false,
          post: {likeCnt: likeCnt - 1, ...otherProps},
          ...other,
        }),
      );
      deletePromiseFn({
        url: APIS.post.place.like(sungan.id).url,
        body: {},
        token: token,
      });
    } else {
      const {
        didLike,
        post: {likeCnt, ...otherProps},
        ...other
      } = post;
      ReactNativeHapticFeedback.trigger('impactLight', options);
      dispatch(
        setMainPost({
          didLike: true,
          post: {likeCnt: likeCnt + 1, ...otherProps},
          ...other,
        }),
      );
      postPromiseFn({
        url: APIS.post.place.like(sungan.id).url,
        body: {},
        token: token,
      });
    }
  }, [sungan]);
  const goToPostDetail = useCallback(() => {
    navigation.navigate(NAV_NAMES.PostDetail, {currentPostId: postKey(post)});
  }, []);
  return (
    <Div bg={'rgba(255,255,255,.9)'} pb10 px20>
      {!mine && (
        <Row itemsCenter py20 borderTopColor={GRAY_COLOR} borderTopWidth={0.3}>
          <Col auto rounded30 overflowHidden mr10>
            <Img
              source={
                IMAGES.characters[sungan.userInfo.userProfileImgUrl] ||
                IMAGES.imageProfileNull
              }
              w25
              h25></Img>
          </Col>
          <Col auto>
            <Span medium>{sungan.userInfo.userName}</Span>
          </Col>
          <Col></Col>
          <Col auto px10 py5 rounded5>
            <Span medium>{sungan.station?.name || '전체'}</Span>
          </Col>
        </Row>
      )}
      <Div py10 onPress={goToPostDetail}>
        <Row rounded20 bgWhite w={'100%'} {...postShadowProp(0.3)}>
          <Col auto justifyCenter itemsCenter px20>
            <Span fontSize={70}>{sungan.emoji}</Span>
          </Col>
          <Col justifyCenter pr20>
            <Span color={'black'} bold mb5>
              {sungan.place}
            </Span>
            <Span color={'black'} medium>
              {sungan.text}
            </Span>
          </Col>
        </Row>
      </Div>
      {!mine && (
        <>
          <Row itemsCenter pt10 pb5>
            <Col auto>
              <Row>
                <Span medium>{`좋아요 ${sungan.likeCnt}개`}</Span>
              </Row>
            </Col>
            <Col></Col>
            <Col auto>
              <Row>
                <Col auto px5 onPress={goToPostDetail}>
                  <MessageCircle {...iconSettings}></MessageCircle>
                </Col>
                <Col auto px5 onPress={like}>
                  <Heart
                    {...iconSettings}
                    fill={post.didLike ? 'red' : 'white'}></Heart>
                </Col>
              </Row>
            </Col>
          </Row>
          {bestComment && (
            <Row
              itemsCenter
              justifyCenter
              pb10
              pt5
              flex
              onPress={goToPostDetail}>
              <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
                <Img
                  source={
                    IMAGES.characters[bestComment.userInfo.userProfileImgUrl] ||
                    IMAGES.imageProfileNull
                  }
                  w15
                  h15></Img>
              </Col>
              <Col mx10 justifyCenter>
                <Row>
                  <Span medium color={'black'}>
                    {`${bestComment.userInfo.userName}  ${bestComment.content}`}
                  </Span>
                </Row>
              </Col>
            </Row>
          )}
          <Row py10>
            <Span color={GRAY_COLOR} fontSize={12}>
              {moment(sungan.createdAt).calendar()}
            </Span>
          </Row>
        </>
      )}
    </Div>
  );
};

export default React.memo(Place);
