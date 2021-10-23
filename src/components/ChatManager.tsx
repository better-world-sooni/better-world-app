import React, { useCallback, useEffect, useState } from 'react';
import Draggable from 'react-native-draggable';
import { Dimensions, Modal } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  pushNewMessage,
  setChatBodyEnabled,
  setChatHeadEnabled,
  setChatRooms,
} from 'src/redux/chatReducer';
import {MessageCircle, X} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import {Span} from './common/Span';
import {Div} from 'src/components/common/Div';
import useSocketInput from 'src/hooks/useSocketInput';

const ChatManager = ({chatSocket}) => {
  const {chatHead, chatBody, chatRooms} = useSelector(
    (root: RootState) => root.chat,
    shallowEqual,
  );
  const {metasunganUser} = useSelector(
    (root: RootState) => root.metasungan,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const sendSocketMessage = useSocketInput();

  const bulkUpdateChatRooms = useCallback(
    bulkUpdateChatRoomsParams => {
      console.log('chatRooms', bulkUpdateChatRoomsParams.chatRooms);
      const newRooms = {};
      bulkUpdateChatRoomsParams.chatRooms.forEach(item => {
        newRooms[item._id] = item;
      });
      dispatch(setChatRooms(newRooms));
    },
    [dispatch],
  );

  const receiveMessage = receiveMessageParams => {
    console.log('receiveMessageParams', receiveMessageParams);
    dispatch(pushNewMessage(receiveMessageParams));
  };

  useEffect(() => {
    chatSocket.on('bulkUpdateChatRooms', bulkUpdateChatRooms);
    chatSocket.on('receiveMessage', receiveMessage);
    return () => {
      chatSocket.off('bulkUpdateChatRooms');
      chatSocket.off('receiveMessage');
    };
  }, [chatSocket]);

  const screenSize = Dimensions.get('screen');
  const inset = 60;
  const screenHeight = screenSize.height;
  const screenWidth = screenSize.width;
  const initialDraggablePosition = {x: screenWidth - inset, y: inset};

  const ChatHead = props => {
    const [draggablePosition, setDraggablePosition] = useState(
      initialDraggablePosition,
    );

    const onRelease = (_event, gestureState, _bounds) => {
      console.log(gestureState);
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
      console.log(finalPosition);
      setDraggablePosition(finalPosition);
    };

    const onDraggablePress = () => {
      dispatch(setChatBodyEnabled(true));
      setDraggablePosition(initialDraggablePosition);
    };

    return (
      <Draggable
        isCircle
        renderSize={80}
        x={draggablePosition.x}
        y={draggablePosition.y}
        onShortPressRelease={onDraggablePress}
        onDragRelease={onRelease}
        shouldReverse>
        <Div p10 bgWhite rounded100 {...shadowProp}>
          {props.children}
        </Div>
      </Draggable>
    );
  };

  const ChatModalHead = ({children, chatRoom, index, length}) => {
    const onPress = () => {
      dispatch(setChatHeadEnabled(true));
    };

    return (
      <Draggable
        isCircle
        renderSize={80}
        x={initialDraggablePosition.x - index * 5}
        y={initialDraggablePosition.y}
        onShortPressRelease={onPress}
        shouldReverse>
        <Div p10 bgWhite rounded100 {...shadowProp}>
          {children}
        </Div>
      </Draggable>
    );
  };

  const shadowProp = {
    shadowOffset: {height: 1, width: 1},
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowRadius: 3,
  };

  const onSend = (messages = []) => {
    messages.forEach(message => {
      sendSocketMessage(chatSocket, 'sendMessage', {
        chatRoomId: chatBody.enabledRoomId,
        message: message,
      });
    });
  };

  return (
    <>
      {chatHead.enabled && (
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
              {chatRooms[chatBody.enabledRoomId]?.title || ''}
            </Span>
          </Div>
          <GiftedChat
            messages={chatRooms[chatBody.enabledRoomId]?.messages || []}
            onSend={messages => onSend(messages)}
            user={{
              _id: metasunganUser._id,
              name: metasunganUser.username,
              avatar: null,
            }}
          />
        </Div>
        {[Object.keys(chatRooms)[0]].map((key, index, array) => {
          return (
            <ChatModalHead
              chatRoom={chatRooms[key]}
              index={index}
              length={array}
              key={index}>
              <X height={30} width={30}></X>
            </ChatModalHead>
          );
        })}
      </Modal>
    </>
  );
};

export default ChatManager;