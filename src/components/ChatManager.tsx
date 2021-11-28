import React, { useCallback, useEffect, useState } from 'react';
import Draggable from 'react-native-draggable';
import {Alert, Dimensions, Modal} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {GiftedChat} from 'react-native-gifted-chat';
import {setChatBodyEnabled, setChatHeadEnabled} from 'src/redux/chatReducer';
import {MessageCircle, X} from 'react-native-feather';
import {HAS_NOTCH, shadowProp, WS_URL} from 'src/modules/constants';
import {Span} from './common/Span';
import {Div} from 'src/components/common/Div';
import useSocketInput from 'src/hooks/useSocketInput';
import {getPromiseFn} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import {Manager} from 'socket.io-client';

const screenSize = Dimensions.get('screen');
const inset = 60;
const screenHeight = screenSize.height;
const screenWidth = screenSize.width;
const initialDraggablePosition = {x: screenWidth - inset, y: inset};

const ChatHead = props => {
  const [draggablePosition, setDraggablePosition] = useState(
    initialDraggablePosition,
  );
  const dispatch = useDispatch();
  const onRelease = (_event, gestureState, _bounds) => {
    const moveX = gestureState.moveX;
    const moveY = gestureState.moveY;
    const closestEdgeX = Math.round(moveX / screenWidth) * screenWidth;
    const closestEdgeY = Math.round(moveY / screenHeight) * screenHeight;
    const withInsetX = value => {
      return value ? value - inset : value + 10;
    };
    const withInsetY = value => {
      return value ? value - inset : value + inset;
    };
    let finalPosition;
    if (Math.abs(closestEdgeX - moveX) > Math.abs(closestEdgeY - moveY)) {
      finalPosition = {
        x: withInsetX(moveX),
        y: withInsetY(closestEdgeY),
      };
    } else {
      finalPosition = {
        x: withInsetX(closestEdgeX),
        y: withInsetY(moveY),
      };
    }
    setDraggablePosition(finalPosition);
  };

  const onDraggablePress = () => {
    dispatch(setChatBodyEnabled(true));
    setDraggablePosition(initialDraggablePosition);
  };

  const onLongPress = () => {
    dispatch(setChatHeadEnabled(false));
  };

  return (
    <Draggable
      isCircle
      renderSize={80}
      x={draggablePosition.x}
      y={draggablePosition.y}
      onShortPressRelease={onDraggablePress}
      onLongPress={onLongPress}
      onDragRelease={onRelease}
      shouldReverse>
      <Div p10 bgWhite rounded100 {...shadowProp}>
        {props.children}
      </Div>
    </Draggable>
  );
};

const ChatModalHead = ({children}) => {
  const dispatch = useDispatch();
  const onPress = () => {
    dispatch(setChatHeadEnabled(true));
  };

  return (
    <Draggable
      isCircle
      renderSize={80}
      x={initialDraggablePosition.x}
      y={initialDraggablePosition.y}
      onShortPressRelease={onPress}
      shouldReverse>
      <Div p10 bgWhite rounded100 {...shadowProp}>
        {children}
      </Div>
    </Draggable>
  );
};

const ChatManager = () => {
  const {chatHeadEnabled, chatBody} = useSelector(
    (root: RootState) => root.chat,
    shallowEqual,
  );
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const sendSocketMessage = useSocketInput();
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
      url: APIS.chat.chat(chatBody.enabledRoomId).url,
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
          chatRoomId: chatBody.enabledRoomId,
          message: message,
        });
      });
    } else {
      Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
    }
  };

  useEffect(() => {
    if (chatBody.enabledRoomId) {
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
        chatRoomId: chatBody.enabledRoomId,
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
  }, [chatBody.enabledRoomId, chatBody.enabled]);
  useEffect(() => {
    if (chatSocket) {
      chatSocket.on('receiveMessage', receiveMessage);
      return () => {
        chatSocket.off('receiveMessage');
      };
    }
  }, [chatSocket, messages]);

  return (
    <>
      {chatHeadEnabled && (
        <ChatHead>
          <MessageCircle height={30} width={30}></MessageCircle>
        </ChatHead>
      )}
      <Modal
        visible={chatBody.enabled}
        animationType={'slide'}
        transparent={true}
        style={{display: 'flex'}}>
        <Div h={HAS_NOTCH ? 44 : 20} />
        <Div h80></Div>
        <Div rounded20 bgWhite flex={1} {...shadowProp}>
          <Div itemsCenter justifyCenter h50>
            <Span bold fontSize={20}>
              {title}
            </Span>
          </Div>
          {metasunganUser._id && (
            <GiftedChat
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
        <ChatModalHead>
          <X height={30} width={30}></X>
        </ChatModalHead>
      </Modal>
    </>
  );
};

export default ChatManager;