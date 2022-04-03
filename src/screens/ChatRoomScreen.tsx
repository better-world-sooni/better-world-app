import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ChevronLeft, CornerDownLeft} from 'react-native-feather';
import {GiftedChat} from 'react-native-gifted-chat';
import {shallowEqual, useSelector} from 'react-redux';
import {Manager} from 'socket.io-client';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {Header} from 'src/components/Header';
import useSocketInput from 'src/hooks/useSocketInput';
import APIS from 'src/modules/apis';
import {cable} from 'src/modules/cable';
import {HAS_NOTCH, iconSettings, WS_URL} from 'src/modules/constants';
import {getPromiseFn} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';

const ChatRoomScreen = props => {
  const currentChatRoomId = props.route.params.currentChatRoomId;
  const roomname = props.route.params.title;
  const username = props.route.params.username;
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const navigation = useNavigation();
  const [title, setTitle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);

  const fetchNewRoom = async callback => {
    const res = await getPromiseFn({
      url: APIS.chat.chat('private', currentChatRoomId).url,
      token,
    });
    if (res?.data?.data) {
      const {title, messages, userIds} = res.data.data;
      setTitle(title);
      setMessages(messages);
      callback();
    }
  };

  const onSend = useCallback(async (messages = []) => {
    console.log(messages)
    console.log(messages[0]["text"])
    if(chatSocket) {
      const _ = await chatSocket.perform('sendMessage', { 
        chatRoomId: currentChatRoomId,
        msg: messages[0] });
    } else {
      Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
    }
    
  }, [chatSocket]);

  const onMessageReceived = (msg) => {
    console.log("receive", msg);
    console.log(users)
    msg['readUserIds'] = users 
    setMessages((m) => [msg, ...m]);
  }

  useLayoutEffect(() => {
    const wsConnect = async () => {
      console.log(token)
      const wsSocket = await cable(token).subscribeTo('ChatChannel', { roomId: currentChatRoomId });
      setChatSocket(wsSocket);
      console.log("wsSocket connected");
    };
    if (currentChatRoomId) {
      wsConnect();
    }
  }, [currentChatRoomId]);

  useEffect(() => {
    if(chatSocket){
      chatSocket.on('message', res => {
        console.log("socket", res['data']);
        if(res["type"] == 'enter') {
          console.log('enter room');
          setUsers((users) => [...users, res['data']]);
        }
      });
      chatSocket.on('close', () => console.log('Disconnected from chat'));
      chatSocket.on('disconnect', () => console.log('No chat connection'));
      chatSocket.perform('enter_room')
    }
    return () => {
      if(chatSocket) {
        console.log("wsSocket will disconnected")
        chatSocket.disconnect();
      }
    }
  }, [chatSocket]);

  useEffect(() => {
    console.log("new user enter", users)
    if(chatSocket){
      chatSocket.on('message', res => {
        console.log("user", res['data']);
        if (res["type"] == 'send') {
          console.log("receive message", users);
          onMessageReceived(res['data']);
        }
      });
    }
  }, [users]);

  return (
    <Div flex bg={'white'}>
      <Header
        bg={'rgba(255,255,255,0)'}
        headerTitle={roomname}
        noButtons
        hasGoBack
      />
      <Div bgWhite flex={1}>
          <GiftedChat
            userCount={2}
            placeholder={'메세지를 입력하세요'}
            // renderAvatarOnTop
            // renderUsernameOnMessage
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: "seunganId",
              name: username,
              // avatar: metasunganUser.avatar,
            }}
          />
      </Div>
    </Div>
  );
};

export default ChatRoomScreen;
