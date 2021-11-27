import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {MessageCircle} from 'react-native-feather';
import {Swipeable} from 'react-native-gesture-handler';
import {APPLE_RED, GRAY_COLOR} from 'src/modules/constants';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';
import moment from 'moment';
import 'moment/locale/ko';
import {NAV_NAMES} from 'src/modules/navNames';
import {patchPromiseFn} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Div} from './common/Div';
moment.locale('ko');

const RightSwipeActions = () => {
  return (
    <Div flex={1} bg={APPLE_RED} justifyCenter itemsEnd>
      <Span color={'white'} px={20} medium>
        채팅방 나가기
      </Span>
    </Div>
  );
};

const ChatRoomItem = ({chatRoomId, userIds, title, createdAt, lastMessage}) => {
  const {currentUser, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );

  const navigation = useNavigation();

  const [deleted, setDeleted] = useState(false);

  const createdAtText = useCallback(createdAt => {
    if (createdAt) {
      const calendar = moment(createdAt).calendar();
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

  const goToChatRoom = roomId => {
    navigation.navigate(NAV_NAMES.ChatRoom, {currentChatRoomId: roomId});
  };
  const exitChatRoom = async roomId => {
    const res = await patchPromiseFn({
      url: APIS.chat.chatRoom.user().url,
      body: {
        userId: currentUser.id,
        chatRoomId: roomId,
      },
      token,
    });
    if (res.ok && res.data?.chatRooms) {
      setDeleted(true);
    }
  };
  if (deleted) {
    return null;
  }
  return (
    <Swipeable
      key={chatRoomId}
      renderRightActions={RightSwipeActions}
      onSwipeableRightOpen={() => exitChatRoom(chatRoomId)}>
      <Row px20 py10 flex onPress={() => goToChatRoom(chatRoomId)} bgWhite>
        <Col auto mr10 relative>
          <MessageCircle
            color={'black'}
            height={50}
            width={50}
            strokeWidth={1}></MessageCircle>
        </Col>
        <Col justifyCenter>
          <Row>
            <Col pr10 auto maxW={'60%'}>
              <Span fontSize={15} bold numberOfLines={1} ellipsizeMode={'tail'}>
                {title}
              </Span>
            </Col>
            <Col auto fontSize={15}>
              <Span color={GRAY_COLOR}>{userIds}</Span>
            </Col>
            <Col justifyCenter itemsEnd>
              <Span fontSize={13} light>
                {createdAtText(createdAt)}
              </Span>
            </Col>
          </Row>
          <Row w={'100%'}>
            <Col>
              <Span fontSize={15} numberOfLines={1} ellipsizeMode={'tail'}>
                {lastMessage}
              </Span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Swipeable>
  );
};

export default React.memo(ChatRoomItem);
