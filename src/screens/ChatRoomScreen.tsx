import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useLayoutEffect, useState, useRef} from 'react';
import {Alert, FlatList, RefreshControl} from 'react-native';
import {ChevronLeft, CornerDownLeft, Search} from 'react-native-feather';
import {GiftedChat} from 'react-native-gifted-chat';
import {shallowEqual, useSelector} from 'react-redux';
import {Manager} from 'socket.io-client';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import useSocketInput from 'src/hooks/useSocketInput';
import apis from 'src/modules/apis';
import {getPromiseFn, useApiSelector} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {cable} from 'src/modules/cable';
import {ChatChannel} from 'src/components/ChatChannel';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAvoidingView, TextInput} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {View} from 'native-base';
import NewMessage from 'src/components/common/NewMessage';
import {useFocusOnce} from 'src/modules/useCustomHooks';
import ChatRoomAvatars from 'src/components/ChatRoomAvatars';

export enum ChatRoomType {
  RoomId,
  DirectMessage,
}
function ChatRoomScreen({
  route: {
    params: {roomName, roomImage, roomId, contractAddress, tokenId, chatRoomType},
  },
}) {
  const flatListRef = useRef(null);
  const {currentNft, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {data: chatRoomRes, isLoading: chatRoomLoad} = useApiSelector(
    chatRoomType == ChatRoomType.RoomId
      ? apis.chat.chatRoom.roomId(roomId)
      : apis.chat.chatRoom.contractAddressAndTokenId(contractAddress, tokenId),
  );

  const currentNftId = {
    token_id: currentNft.token_id,
    contract_address: currentNft.contract_address,
  };
  const currentAvatar = currentNft.nft_metadatum.image_uri;
  const {goBack} = useNavigation();

  const [connectRoomId, setConnectRoomId] = useState(null);
  const [chatSocket, setChatSocket] = useState(null);
  const [numNfts, setNumNfts] = useState(null);
  const [enterNfts, setEnterNfts] = useState([]);
  const [messages, setMessages] = useState(
    chatRoomRes ? chatRoomRes.init_messages : [],
  );
  const [text, setText] = useState('');
  const [isNew, setIsNew] = useState(
    (chatRoomRes ? chatRoomRes.init_messages : []).length == 0,
  );

  const handleTextChange = text => {
    setText(text);
  };

  const sendMessage = async () => {
    if (chatSocket) {
      const Timestamp = new Date();
      const msg = {
        text: text,
        nft: currentNftId,
        avatar: currentAvatar,
        read_nft_ids: enterNfts,
        created_at: Timestamp,
        updated_at: Timestamp,
      };
      const room = {
        room_id: connectRoomId,
        room_profile_imgs: roomImage,
        last_message: text,
        room_name: roomName
      };
      if (isNew) {
        const _ = await chatSocket.sendNew(msg, room);
      } else {
        const _ = await chatSocket.send(msg, room);
      }
    } else {
      Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
    }
    setText('');
  };

  useEffect(() => {
    if(connectRoomId){
      const channel = new ChatChannel({roomId: connectRoomId});
      const wsConnect = async () => {
        await cable(token).subscribe(channel);
        setChatSocket(channel);
        channel.on('enter', res => {
          console.log("enter res", res)
          setEnterNfts(res['new_nfts']);
          setMessages(res['update_msgs']);
        });
        let _ = await channel.enter(connectRoomId);
        channel.on('message', res => {
          setMessages(m => [...m, res['data']]);
        });
        channel.on('leave', res => {
          if (currentNftId != res['leave_nft']) {
            setEnterNfts(res['new_nfts']);
          }
        });
        channel.on('new', res => {
          setIsNew(false);
        });
        channel.on('close', () => console.log('Disconnected from chat'));
        channel.on('disconnect', () => console.log('check disconnect'));
      };
      wsConnect();
      return () => {
        if (channel) {
          channel.disconnect();
          channel.close();
        }
      };
    }
  }, [connectRoomId]);


  const scrollToEnd = () => {
    flatListRef?.current?.scrollToEnd({animated: true});
  };
  const headerHeight = HAS_NOTCH ? 94 : 70;
  const isSameNft = (nft1, nft2) => {
    nft1?.token_id === nft2?.token_id &&
    nft1?.contract_address === nft2?.contract_address;
  };

  useEffect(() => {
    if(chatRoomRes){
      console.log("api fin", chatRoomRes)
      setMessages(chatRoomRes.init_messages);
      setConnectRoomId(chatRoomRes.room_id);
      setIsNew(chatRoomRes.init_messages.length == 0);
      setNumNfts(chatRoomRes.num_nfts);
      scrollToEnd();
    }
  }, [chatRoomRes])

  return (
    <KeyboardAvoidingView flex={1} bgWhite behavior="padding">
      <Div h={headerHeight} zIndex={100}>
        <BlurView
          blurType="xlight"
          blurAmount={30}
          blurRadius={20}
          style={{
            width: DEVICE_WIDTH,
            height: headerHeight,
            position: 'absolute',
          }}
          reducedTransparencyFallbackColor="white"></BlurView>
        <Row
          itemsCenter
          py5
          h40
          px15
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={HAS_NOTCH ? 49 : 25}>
          <Col justifyStart mr10>
            <Div bgRealBlack p5 rounded100 onPress={goBack} w30>
              <ChevronLeft
                width={20}
                height={20}
                color="white"
                strokeWidth={3}
              />
            </Div>
          </Col>
          <Col auto relative mr10>
            <Div rounded100 overflowHidden h50>
              <ChatRoomAvatars
                firstUserAvatar={roomImage[0]}
                secondUserAvatar={roomImage[1]}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={19}>
              {roomName}
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <Div flex={1}>
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 5,
            paddingBottom: 5,
            justifyContent: 'flex-end',
            flexGrow: 1,
            flexDirection: 'column',
          }}
          data={messages}
          renderItem={({item: message, index}) => {
            const author = (message as any).nft;
            const isConsecutive = isSameNft(messages[index - 1]?.nft, author);
            const isMine = isSameNft(author, currentNftId);
            return (
              <Message
                message={message}
                index={index}
                isConsecutive={isConsecutive}
                isMine={isMine}
                numNfts={numNfts}
              />
            );
          }}></FlatList>
      </Div>
      <NewMessage
        text={text}
        onFocus={scrollToEnd}
        onTextChange={handleTextChange}
        onPressSend={sendMessage}
      />
    </KeyboardAvoidingView>
  );
}
const Message = ({message, index, isConsecutive, isMine, numNfts}) => {
  const text = message.text;
  const time = new Date(message.created_at);
  const avatar = message.avatar;
  const unreadCount = numNfts - message.read_nft_ids.length;
  return (
    <Div key={index} px15>
      <Row
        // {...(isMine && {style: {flexDirection: 'row-reverse'}})}
        itemsEnd
        py3>
        <Col auto w28 px0 mb3>
          {!isConsecutive && <Img rounded100 uri={avatar} h31 w31 />}
        </Col>
        <Col
          auto={!isMine}
          style={isMine ? {flex: 5, wordBreak: 'break-all', flexDirection: 'row-reverse'} : {wordBreak: 'break-all'}}
          itemsEnd>
          <Div bgGray100={!isMine} bgPrimary={isMine} rounded30 p8 px16 mx10>
            <Span fontSize={16} white={isMine}>
              {text}
            </Span>
          </Div>
          <Div fontSize={10}>
            <Span>{unreadCount}</Span>
          </Div>
        </Col>
        <Col style={{flex: 1}}></Col>
      </Row>
    </Div>
  );
};

export default ChatRoomScreen;
