import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ChevronLeft, ChevronsRight} from 'react-native-feather';
import {GiftedChat} from 'react-native-gifted-chat';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Manager} from 'socket.io-client';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import useSocketInput from 'src/hooks/useSocketInput';
import APIS from 'src/modules/apis';
import {HAS_NOTCH, iconSettings, WS_URL} from 'src/modules/constants';
import {View} from 'src/modules/viewComponents';
import {getPromiseFn} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';

const ChatRoomScreen = props => {
  const currentChatRoomId = props.route.params.currentChatRoomId;
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const sendSocketMessage = useSocketInput();
  const navigation = useNavigation();
  const [title, setTitle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);
  const [metasunganUser, setMetasunganUser] = useState({
    _id: null,
    metaSid: null,
    chatSid: null,
    username: null,
    posOnNewScene: {
      x: null,
      y: null,
    },
    chatBubble: null,
    updatedAt: null,
    chatRoomIds: [],
    avatar: null,
  });
  const login = useCallback(loginParams => {
    setMetasunganUser(loginParams.user);
  }, []);
  const receiveMessage = receiveMessageParams => {
    setMessages([receiveMessageParams.message, ...messages]);
  };
  const fetchNewRoom = async () => {
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
  };
  const onSend = (messages = []) => {
    if (chatSocket) {
      messages.forEach(message => {
        sendSocketMessage(chatSocket, 'sendMessage', {
          chatRoomId: currentChatRoomId,
          message: message,
        });
      });
    } else {
      Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
    }
  };
  useEffect(() => {
    if (currentChatRoomId) {
      fetchNewRoom();
      const manager = new Manager(WS_URL, {
        reconnectionDelayMax: 5000,
        forceNew: true,
      });
      const newSocket = manager.socket('/chat', {
        auth: {
          token: token,
        },
      });
      sendSocketMessage(newSocket, 'enterChatRoom', {
        chatRoomId: currentChatRoomId,
      });
      newSocket.on('login', login);
      newSocket.on('disconnect', () => setChatSocket(null));

      setChatSocket(newSocket);
      return () => {
        newSocket.off('login');
        newSocket.off('disconnect');
        newSocket.close();
        setChatSocket(null);
      };
    }
  }, [currentChatRoomId]);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on('receiveMessage', receiveMessage);
      return () => {
        chatSocket.off('receiveMessage');
      };
    }
  }, [chatSocket, messages]);

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
        {metasunganUser._id && (
          <GiftedChat
            placeholder={'메세지를 입력하세요'}
            renderAvatarOnTop
            renderUsernameOnMessage
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: metasunganUser._id,
              name: metasunganUser.username,
              avatar: metasunganUser.avatar,
            }}
          />
        )}
      </Div>
    </Div>
  );
};

export default ChatRoomScreen;
