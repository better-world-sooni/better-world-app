import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useLayoutEffect, useState, useRef} from 'react';
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
import {ChatChannel} from 'src/components/ChatChannel'

const ChatRoomScreen = props => {
  const currentChatRoomId = props.route.params.currentChatRoomId;
  const roomname = props.route.params.title;
  const numUsers = props.route.params.numUsers;

  const {token, currentUser} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const userUuid = currentUser.uuid;
  const userAvatar = currentUser.main_avatar_nft.nft_metadatum.image_url;

  const [messages, setMessages] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);
  const messagesRef = useRef(messages)

  const fetchNewRoom = async callback => {
    // const res = await getPromiseFn({
    //   url: APIS.chat.chat('private', currentChatRoomId).url,
    //   token,
    // });
    // if (res?.data?.data) {
    //   const {title, messages, userIds} = res.data.data;
    //   setTitle(title);
    //   setMessages(messages);
    //   callback();
    // }
  };

  const onSend = useCallback(async (messages = []) => {
    console.log("send: ", messages[0]["text"]);
    if(chatSocket) {
      const _ = await chatSocket.send(messages);
    } else {
      Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
    }
  }, [chatSocket]);

  useEffect(() => {
    messagesRef.current = messages; 
  }, [messages]);

  useLayoutEffect(() => {
    let channel;
    const wsConnect = async () => {
      console.log(token);
      channel = new ChatChannel({ roomId: currentChatRoomId });
      await cable(token).subscribe(channel);
      setChatSocket(channel);
      channel.on('enter', res => {
        console.log("enter", res['data'], "current_user:", userUuid, messagesRef.current);
        
        if(userUuid != res['data']) {
          channel.update(messagesRef.current);
        }
      });
      channel.on('message', res => {
        console.log("message receive", userUuid, res['data'])
        setMessages((m) => [...res['data'], ...m]);
      });
      channel.on('update', res => {
        console.log("update", res['data'])
        setMessages([...res['data']])
      })
      channel.on('close', () => console.log('Disconnected from chat'));
      channel.on('disconnect', () => console.log('No chat connection'));
      let _ = await channel.enter();
    };
    if (currentChatRoomId) {
      wsConnect();
    }
    return() => {
      if(channel) {
        channel.disconnect();
        channel.close();
      }   
    }
  }, [currentChatRoomId]);

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
            userCount={numUsers}
            placeholder={'메세지를 입력하세요'}
            // renderAvatarOnTop
            // renderUsernameOnMessage
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              id: userUuid,
              avatar: userAvatar,
            }}
          />
      </Div>
    </Div>
  );
};

export default ChatRoomScreen;
