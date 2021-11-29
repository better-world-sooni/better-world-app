import React, {useCallback} from 'react';
import {IMAGES} from 'src/modules/images';
import {Col} from './common/Col';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {useNavigation} from '@react-navigation/core';
import {NAV_NAMES} from 'src/modules/navNames';
import {
  iconSettings,
  kmoment,
  LINE2_COLOR,
  PLACE,
  REPORT,
  SUNGAN,
} from 'src/modules/constants';
import APIS from 'src/modules/apis';
import {getPromiseFn} from 'src/redux/asyncReducer';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {isOkay} from 'src/modules/utils';
import {Alert} from 'react-native';
import {Heart, MessageCircle} from 'react-native-feather';

const NotificationItem = ({
  title,
  createdAt,
  body,
  goto,
  notiType,
  postId,
  postType,
  chatRoomId,
}) => {
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const navigation = useNavigation();
  const Icon = () => {
    if (chatRoomId) {
      return (
        <MessageCircle
          strokeWidth={1.3}
          color={LINE2_COLOR}
          width={40}
          height={40}
        />
      );
    }
    if (notiType == 'Post') {
      return (
        <Heart strokeWidth={1.3} color={LINE2_COLOR} width={40} height={40} />
      );
    }
    return <Img source={IMAGES.mainLogo} w40 h40></Img>;
  };
  const createdAtText = useCallback(createdAt => {
    if (createdAt) {
      const calendar = kmoment(createdAt).calendar();
      const calendarArr = calendar.split(' ');
      if (calendarArr[0] == '오늘') {
        return calendarArr[1] + ' ' + calendarArr[2];
      }
      if (calendarArr[0] == '어제') {
        return calendarArr[0];
      }
      return calendarArr[0] + ' ' + calendarArr[1];
    }
    return null;
  }, []);

  const handlePress = async () => {
    if (goto == 'Home') {
      navigation.navigate(goto);
      return;
    }
    if (goto == 'Post') {
      let url;
      let type;
      let get;
      if (postType == 'Sungan') {
        url = APIS.post.sungan.id(postId).url;
        type = SUNGAN;
        get = 'sungan';
      } else if (postType == 'Hotplace') {
        url = APIS.post.place.id(postId).url;
        type = PLACE;
        get = 'hotplace';
      } else {
        url = APIS.post.place.id(postId).url;
        type = REPORT;
        get = 'report';
      }
      const res = await getPromiseFn({
        url,
        token,
      });
      if (!isOkay(res)) {
        Alert.alert('해당 게시물은 지워졌습니다.');
      }
      const item = res.data.data;
      const post = item[get];
      const didLike = post.didLike;
      const likeCount = post.likeCnt;
      const stationName = post.station?.name;
      const emoji = post.emoji;
      const userName = post.userInfo.userName;
      const userProfileImgUrl = post.userInfo.userProfileImgUrl;
      const createdAt = post.createdAt;
      const text = post.text;
      const place = post.place;
      const vehicleIdNum = post.vehicleIdNum;
      const currentPost = {
        type,
        didLike,
        stationName,
        emoji,
        userName,
        userProfileImgUrl,
        createdAt,
        likeCount,
        text,
        place,
        vehicleIdNum,
      };
      navigation.navigate(NAV_NAMES.PostDetail, {
        currentPost: {
          setLiked: () => {},
          setLikeCount: () => {},
          ...currentPost,
        },
      });
    }
    if (goto == 'Chat') {
      navigation.navigate(NAV_NAMES.ChatRoom, {currentChatRoomId: chatRoomId});
    }
  };

  return (
    <Row px20 py10 flex bg={'white'} onPress={handlePress}>
      <Col auto mr10 relative>
        <Icon />
      </Col>
      <Col justifyCenter>
        <Row>
          <Col pr10 auto maxW={'60%'}>
            <Span fontSize={15} bold numberOfLines={1} ellipsizeMode={'tail'}>
              {title}
            </Span>
          </Col>
          <Col />
          <Col justifyCenter itemsEnd>
            <Span fontSize={13} light>
              {createdAtText(createdAt)}
            </Span>
          </Col>
        </Row>
        <Row w={'100%'}>
          <Col pr10>
            <Span fontSize={15} numberOfLines={1} ellipsizeMode={'tail'}>
              {body}
            </Span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(NotificationItem);
