import React, {useState} from 'react';
import {Heart, MessageCircle} from 'react-native-feather';
import APIS from 'src/modules/apis';
import {GRAY_COLOR, iconSettings} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {NAV_NAMES} from 'src/modules/navNames';
import {deletePromiseFn, postPromiseFn} from 'src/redux/asyncReducer';
import {setCurrentPost} from 'src/redux/feedReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';

export const Sungan = ({post, dispatch, navigation, token, mine = null}) => {
  const sungan = post.post;
  const bestComment = post.bestComment;
  const shadowProp = opacity => {
    return {
      shadowOffset: {height: 1, width: 1},
      shadowColor: GRAY_COLOR,
      shadowOpacity: opacity,
      shadowRadius: 10,
    };
  };
  const [isLiked, setIsLiked] = useState(post.didLike);
  const like = async () => {
    if (isLiked) {
      const res = await deletePromiseFn({
        url: APIS.post.sungan.like(sungan.id).url,
        body: {},
        token: token,
      });
      res.status == 200 && setIsLiked(false);
    } else {
      const res = await postPromiseFn({
        url: APIS.post.sungan.like(sungan.id).url,
        body: {},
        token: token,
      });
      res.status == 200 && setIsLiked(true);
    }
  };
  const goToPostDetail = () => {
    dispatch(setCurrentPost(post));
    navigation.navigate(NAV_NAMES.PostDetail);
  };

  return (
    <Div bg={'rgba(255,255,255,.9)'} pb10 px20>
      {!mine && (
        <Row itemsCenter py20 borderTopColor={GRAY_COLOR} borderTopWidth={0.3}>
          <Col auto rounded30 overflowHidden mr10>
            <Img source={IMAGES.example2} w25 h25></Img>
          </Col>
          <Col auto>
            <Span medium>{sungan.userInfo.userName}</Span>
          </Col>
          <Col></Col>
          <Col auto px10 py5 rounded5>
            <Span medium>{sungan.station.name}</Span>
          </Col>
        </Row>
      )}
      <Div py10 onPress={goToPostDetail}>
        <Row rounded20 bgWhite w={'100%'} {...shadowProp(0.3)}>
          <Col auto justifyCenter itemsCenter px20>
            <Span fontSize={70}>{sungan.emoji}</Span>
          </Col>
          <Col justifyCenter>
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
                <Span medium>{`좋아요 ${
                  sungan.likeCnt +
                  (!post.didLike && isLiked ? 1 : 0) -
                  (post.didLike && !isLiked ? 1 : 0)
                }개`}</Span>
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
                    fill={isLiked ? 'red' : 'white'}></Heart>
                </Col>
              </Row>
            </Col>
          </Row>
          {sungan.comments.length > 1 && (
            <Row itemsCenter py5>
              <Span color={'gray'}>{`${
                sungan.comments.length - 1
              }개 댓글 더보기`}</Span>
            </Row>
          )}
          {bestComment && (
            <Row itemsCenter justifyCenter pb10 pt5 flex>
              <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
                <Img source={IMAGES.example2} w15 h15></Img>
              </Col>
              <Col mx10 justifyCenter>
                <Row>
                  <Span medium color={'black'}>
                    irlyglo
                  </Span>
                  <Span ml5>{bestComment.content}</Span>
                </Row>
              </Col>
              <Col auto itemsCenter justifyCenter>
                <Heart color={'black'} height={14}></Heart>
              </Col>
            </Row>
          )}
        </>
      )}
    </Div>
  );
};
