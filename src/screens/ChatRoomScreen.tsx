import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {ChevronLeft, ChevronsRight} from 'react-native-feather';
import {GiftedChat} from 'react-native-gifted-chat';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import useSocketInput from 'src/hooks/useSocketInput';
import APIS from 'src/modules/apis';
import {HAS_NOTCH, iconSettings} from 'src/modules/constants';
import {getPromiseFn} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';

const ChatRoomScreen = props => {
  const currentChatRoomId = props.route.params.currentChatRoomId;
  const {chatSocket} = useSelector(
    (root: RootState) => root.chat,
    shallowEqual,
  );
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {metasunganUser} = useSelector(
    (root: RootState) => root.metasungan,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const sendSocketMessage = useSocketInput();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const receiveMessage = receiveMessageParams => {
    setMessages([receiveMessageParams.message, ...messages]);
  };

  const fetchRoom = async () => {
    setLoading(true);
    const res = await getPromiseFn({
      url: APIS.chat.chat(currentChatRoomId).url,
      token,
    });
    if (res?.data?.data) {
      const {title, messages, userIds} = res.data.data;
      setTitle(title);
      setMessages(messages);
      setUsers(userIds);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on('receiveMessage', receiveMessage);
      return () => {
        chatSocket.off('receiveMessage');
      };
    }
  }, [chatSocket, messages]);

  useEffect(() => {
    fetchRoom();
  }, [currentChatRoomId]);

  const onSend = (messages = []) => {
    messages.forEach(message => {
      sendSocketMessage(chatSocket, 'sendMessage', {
        chatRoomId: currentChatRoomId,
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
              {title}
            </Span>
          </Col>
          <Col auto px10>
            <ChevronLeft {...iconSettings} color={'white'}></ChevronLeft>
          </Col>
        </Row>
        <GiftedChat
          renderAvatarOnTop
          renderUsernameOnMessage
          messages={messages}
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
