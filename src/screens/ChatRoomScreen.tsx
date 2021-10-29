import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {ChevronLeft, ChevronsRight} from 'react-native-feather';
import {GiftedChat} from 'react-native-gifted-chat';
import {shallowEqual, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import useSocketInput from 'src/hooks/useSocketInput';
import {HAS_NOTCH, iconSettings} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';

const ChatRoomScreen = () => {
  const {chatRooms, currentChatRoom, chatSocket} = useSelector(
    (root: RootState) => root.chat,
    shallowEqual,
  );

  const {metasunganUser} = useSelector(
    (root: RootState) => root.metasungan,
    shallowEqual,
  );

  const navigation = useNavigation();

  const sendSocketMessage = useSocketInput();

  const onSend = (messages = []) => {
    messages.forEach(message => {
      sendSocketMessage(chatSocket, 'sendMessage', {
        chatRoomId: currentChatRoom.roomId,
        message: message,
      });
    });
  };

  return (
    <Div flex bg={'white'}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Div bgWhite flex={1}>
        <Row justifyCenter py20>
          <Col auto px10 onPress={() => navigation.goBack()}>
            <ChevronLeft {...iconSettings}></ChevronLeft>
          </Col>
          <Col itemsCenter>
            <Span bold fontSize={20}>
              {chatRooms[currentChatRoom.roomId]?.title || ''}
            </Span>
          </Col>
          <Col auto px10>
            <ChevronLeft {...iconSettings} color={'white'}></ChevronLeft>
          </Col>
        </Row>
        <GiftedChat
          messages={
            [...chatRooms[currentChatRoom.roomId]?.messages].reverse() || []
          }
          onSend={messages => onSend(messages)}
          user={{
            _id: metasunganUser._id,
            name: metasunganUser.username,
            avatar: null,
          }}
        />
      </Div>
    </Div>
  );
};

export default ChatRoomScreen;
