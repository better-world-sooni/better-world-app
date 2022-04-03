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
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const sendSocketMessage = useSocketInput();
  const navigation = useNavigation();
  const [title, setTitle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(["seungan", "sehan"]);
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
  // const login = useCallback(loginParams => {
  //   setMetasunganUser(loginParams.user);
  // }, []);


  const enterChatRoom = enterChatRoomParams => {
    console.log('enterChatRoom', enterChatRoomParams.chatRoom.messages);
    setMessages(enterChatRoomParams.chatRoom.messages);
  };
  const readMessage = readMessageParams => {
    console.log('readMessage', readMessageParams.chatRoom.messages);
    setMessages(readMessageParams.chatRoom.messages);
  };
  const fetchNewRoom = async callback => {
    const res = await getPromiseFn({
      url: APIS.chat.chat('private', currentChatRoomId).url,
      token,
    });
    if (res?.data?.data) {
      const {title, messages, userIds} = res.data.data;
      setTitle(title);
      setMessages(messages);
      setUsers(userIds);
      callback();
    }
  };
  const onSend = useCallback(async (messages = []) => {
    console.log(messages)
    console.log(messages[0]["text"])
    // if (chatSocket) {
    //   messages.forEach(message => {
    //     sendSocketMessage(chatSocket, 'sendMessage', {
    //       chatRoomId: currentChatRoomId,
    //       message: message,
    //     });
    //   });
    // } else {
    //   Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
    // }

    // const msg = {
    //   author: user.username,
    //   message: msgText,
    //   timestamp: new Date().getTime(),
    //   buddy: "sehan"
    // }
    // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const _ = await chatSocket.perform('sendMessage', { 
      chatRoomId: currentChatRoomId,
      msg: messages })
  }, [chatSocket]);

  const receiveMessage = receiveMessageParams => {
    const newMessage = receiveMessageParams.message;
    setMessages([newMessage, ...messages]);
    if (chatSocket) {
      sendSocketMessage(chatSocket, 'readMessage', {
        chatRoomId: currentChatRoomId,
        messageId: newMessage._id,
      });
    }
  };


  const onMessageReceived = (msg) => {
    console.log("receive", msg);
    setMessages((m) => [...m, msg]);
    // setMessages([msg, ...messages]);
  }


  useLayoutEffect(() => {
    const wsConnect = async () => {
      console.log(token)
      const wsSocket = await cable(token).subscribeTo('ChatChannel', { username: "seungan" });
      console.log("wsSocket connected")
      wsSocket.on('message', msg => {
        onMessageReceived(msg)
      });
      setChatSocket(wsSocket);
    };
    if (currentChatRoomId) {
      // const manager = new Manager(WS_URL, {
      //   reconnectionDelayMax: 5000,
      // });
      // const newSocket = manager.socket('/chat', {
      //   auth: {
      //     token: token,
      //   },
      // });
      // fetchNewRoom(() => {
      //   sendSocketMessage(newSocket, 'enterChatRoom', {
      //     chatRoomId: currentChatRoomId,
      //   });
      // });
      // newSocket.on('login', login);
      // newSocket.on('disconnect', () => setChatSocket(null));
      // newSocket.on('enterChatRoom', enterChatRoom);
      // newSocket.on('readMessage', readMessage);
      // setChatSocket(newSocket);
      // return () => {
      //   newSocket.off('login');
      //   newSocket.off('disconnect');
      //   newSocket.off('enterChatRoom');
      //   newSocket.off('readMessage');
      //   newSocket.close();
      //   setChatSocket(null);
      // };
      wsConnect();
      // fetchNewRoom(() => {
      //   sendSocketMessage(newSocket, 'enterChatRoom', {
      //     chatRoomId: currentChatRoomId,
      //   });
      // });
      
    }
  }, [currentChatRoomId]);

  useEffect(() => {
    return () => {
      if(chatSocket) {
        console.log("wsSocket will disconnected")
        chatSocket.disconnect();
      }
    }
  }, [chatSocket, messages]);

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
              _id: "seungan",
              name: "seungan1",
              // avatar: metasunganUser.avatar,
            }}
          />
      </Div>
    </Div>
  );
};

export default ChatRoomScreen;
