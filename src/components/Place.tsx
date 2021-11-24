import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {Heart, MessageCircle} from 'react-native-feather';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {
  GRAY_COLOR,
  HEART_COLOR,
  iconSettings,
  NUM_OF_LINES_ON_POST,
  PLACE,
  postShadowProp,
} from 'src/modules/constants';
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
import BestComment from './BestComment';
import {Alert} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
moment.locale('ko');

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const RightSwipeActions = () => {
  return (
    <Div flex={1} bg={'red'} justifyCenter itemsEnd>
      <Span color={'#40394a'} px={20} medium>
        포스트 지우기
      </Span>
    </Div>
  );
};

export const Place = props => {
  const {
    app: {
      session: {token},
    },
  } = useSelector((root: RootState) => root, shallowEqual);
  const {
    didLike,
    postId,
    stationName,
    emoji,
    userName,
    userProfileImgUrl,
    createdAt,
    likeCnt,
    text,
    place,
    children,
    mine = null,
    userNameBC,
    userProfileImgUrlBC,
    contentBC,
    deletePost = null
  } = props;
  const navigation = useNavigation();
  const [liked, setLiked] = useState(didLike);
  const [likeCount, setLikeCount] = useState(likeCnt);
  const like = () => {
    if (liked) {
      ReactNativeHapticFeedback.trigger('impactLight', options);
      setLiked(false);
      setLikeCount(likeCount - 1);
      deletePromiseFn({
        url: APIS.post.place.like(postId).url,
        body: {},
        token: token,
      });
    } else {
      ReactNativeHapticFeedback.trigger('impactLight', options);
      setLiked(true);
      setLikeCount(likeCount - 1);
      postPromiseFn({
        url: APIS.post.place.like(postId).url,
        body: {},
        token: token,
      });
    }
  };
  const goToPostDetail = () => {
    const {didLike, ...currentPost} = props;
    navigation.navigate(NAV_NAMES.PostDetail, {
      currentPost: {
        liked,
        setLiked,
        likeCount,
        setLikeCount,
        type: PLACE,
        ...currentPost,
      },
    });
  };
  
  if (mine) {
    <Swipeable
      renderRightActions={RightSwipeActions}
      onSwipeableRightOpen={deletePost}>
      <Div bg={'rgba(255,255,255,.9)'} py5 px20>
        <Row
          py10
          rounded20
          bgWhite
          w={'100%'}
          {...postShadowProp(0.3)}
          onPress={goToPostDetail}>
          <Col auto justifyCenter itemsCenter px20>
            <Span fontSize={70}>{emoji}</Span>
          </Col>
          <Col justifyCenter pr20 py10>
            <Span color={'black'} bold mb5>
              {place}
            </Span>
            <Span
              color={'black'}
              medium
              numberOfLines={NUM_OF_LINES_ON_POST}
              ellipsizeMode={'tail'}>
              {text}
            </Span>
          </Col>
        </Row>
      </Div>
    </Swipeable>;
  }
  return (
    <Div bg={'rgba(255,255,255,.9)'} py5 px20>
      <Row itemsCenter py20 borderTopColor={GRAY_COLOR} borderTopWidth={0.3}>
        <Col auto rounded30 overflowHidden mr10>
          <Img
            source={
              IMAGES.characters[userProfileImgUrl] || IMAGES.imageProfileNull
            }
            w25
            h25></Img>
        </Col>
        <Col auto>
          <Span medium>{userName}</Span>
        </Col>
        <Col></Col>
        <Col auto px10 py5 rounded5>
          <Span medium>{stationName || '전체'}</Span>
        </Col>
      </Row>
      <Row
        py10
        rounded20
        bgWhite
        w={'100%'}
        {...postShadowProp(0.3)}
        onPress={goToPostDetail}>
        <Col auto justifyCenter itemsCenter px20>
          <Span fontSize={70}>{emoji}</Span>
        </Col>
        <Col justifyCenter pr20 py10>
          <Span color={'black'} bold mb5>
            {place}
          </Span>
          <Span
            color={'black'}
            medium
            numberOfLines={NUM_OF_LINES_ON_POST}
            ellipsizeMode={'tail'}>
            {text}
          </Span>
        </Col>
      </Row>
      <Row itemsCenter pt10 pb5>
        <Col auto>
          <Row>
            <Span medium>{`좋아요 ${likeCount}개`}</Span>
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
                strokeWidth={liked ? 0 : 1.3}
                fill={liked ? HEART_COLOR : 'white'}></Heart>
            </Col>
          </Row>
        </Col>
      </Row>
      {userNameBC && (
        <BestComment
          userName={userNameBC}
          userProfileImgUrl={userProfileImgUrlBC}
          content={contentBC}
          onPress={goToPostDetail}
        />
      )}
      <Row py10>
        <Span color={GRAY_COLOR} fontSize={12}>
          {moment(createdAt).calendar()}
        </Span>
      </Row>
    </Div>
  );
};

export default React.memo(Place);
