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
  const username = props.route.params.username;
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const navigation = useNavigation();
  const [title, setTitle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);

  const readCountUpdateFunRef = useRef(null);
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

  useEffect(() => {
    const readCountUpdate = (enterUser) => {
      console.log("EnterUser", enterUser)
      
      let msgs = [...messages]
      console.log("before", msgs)
      for(const message of msgs) {
        if(message.readUserIds.includes(enterUser)) break;
        message.readUserIds.push(enterUser)
      }
      console.log("after", msgs)
      return msgs 
    }
    readCountUpdateFunRef.current = readCountUpdate
  }, [messages]);

  const onSend = useCallback(async (messages = []) => {
    console.log("send: ", messages[0]["text"]);
    if(chatSocket) {
      const _ = await chatSocket.send(messages);
    } else {
      Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
    }
  }, [chatSocket]);

  useLayoutEffect(() => {
    let channel;
    const wsConnect = async () => {
      console.log(token);
      channel = new ChatChannel({ roomId: currentChatRoomId });
      await cable(token).subscribe(channel);
      setChatSocket(channel);
      channel.on('enter', res => {
        console.log("enter", res['data']);
        if(username != res['data']) {
          let msgs = readCountUpdateFunRef.current(res['data'])
          if(msgs.length) {
            console.log("update goes" , msgs)
            channel.update(msgs);
          }
        }
      });
      channel.on('message', res => {
        console.log(username, res['data'])
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
            userCount={2}
            placeholder={'메세지를 입력하세요'}
            // renderAvatarOnTop
            // renderUsernameOnMessage
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: username,
              name: username,
              // avatar: metasunganUser.avatar,
            }}
          />
      </Div>
    </Div>
  );
};

export default ChatRoomScreen;
