import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useLayoutEffect, useState, useRef} from 'react';
import {Alert, FlatList} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {cable} from 'src/modules/cable';
import {ChatChannel} from 'src/components/ChatChannel';
import {HAS_NOTCH, kmoment} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {BlurView} from '@react-native-community/blur';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import NewMessage from 'src/components/common/NewMessage';
import {createdAtText, getCalendarDay} from 'src/modules/timeUtils';

export enum ChatRoomType {
  RoomId,
  DirectMessage,
}
function ChatRoomScreen({
  route: {
    params: {
      roomName,
      roomImage,
      roomId,
      contractAddress,
      tokenId,
      chatRoomType,
    },
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
        last_message: text,
        room_name: roomName,
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
    if (connectRoomId) {
      const channel = new ChatChannel({roomId: connectRoomId});
      const wsConnect = async () => {
        await cable(token).subscribe(channel);
        setChatSocket(channel);
        channel.on('enter', res => {
          setEnterNfts(res['new_nfts']);
          setMessages(res['update_msgs']);
        });
        let _ = await channel.enter(connectRoomId);
        channel.on('message', res => {
          setMessages(m => [res['data'], ...m]);
        });
        channel.on('leave', res => {
          if (currentNftId != res['leave_nft']) {
            setEnterNfts(res['new_nfts']);
          }
        });
        channel.on('new', res => {
          setIsNew(false);
        });
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
    flatListRef?.current?.scrollToEnd({animated: false});
  };
  const headerHeight = HAS_NOTCH ? 94 : 70;
  const isSameNft = useCallback((nft1, nft2) => {
    return (
      nft1?.token_id === nft2?.token_id &&
      nft1?.contract_address === nft2?.contract_address
    );
  }, []);
  const hasMintuesChanged = useCallback((createdAt1, createdAt2) => {
    if (!createdAt2) return true;
    return (
      Math.round(
        (new Date(createdAt1).getTime() - new Date(createdAt2).getTime()) /
          60000,
      ) !== 0
    );
  }, []);
  const hasDateChanged = useCallback((createdAt1, createdAt2) => {
    if (!createdAt2) return true;
    return (
      Math.round(
        (new Date(createdAt1).getTime() - new Date(createdAt2).getTime()) /
          (60000 * 60 * 24),
      ) !== 0
    );
  }, []);
  useEffect(() => {
    console.log(chatRoomRes);
    if (chatRoomRes) {
      console.log(chatRoomRes);
      setMessages(chatRoomRes.init_messages);
      setConnectRoomId(chatRoomRes.room_id);
      setIsNew(chatRoomRes.init_messages.length == 0);
      setNumNfts(chatRoomRes.num_nfts);
    }
  }, [chatRoomRes]);
  console.log(chatRoomRes);

  return (
    <>
      <Div h={headerHeight} zIndex={100}>
        <CustomBlurView
          blurType="xlight"
          blurAmount={30}
          blurRadius={20}
          overlayColor=""
          style={{
            width: DEVICE_WIDTH,
            height: headerHeight,
            position: 'absolute',
          }}
          ></CustomBlurView>
        <Row
          itemsCenter
          py5
          h40
          px8
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={HAS_NOTCH ? 49 : 25}>
          <Col justifyStart mr10>
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color="black"
                strokeWidth={2}
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
      <KeyboardAvoidingView flex={1} bgWhite behavior="padding">
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          contentInset={{bottom: 5, top: 5}}
          inverted
          data={messages}
          initialNumToRender={25}
          keyExtractor={item => item._id.$oid}
          renderItem={({item: message, index}) => {
            const author = (message as any).nft;
            const isMine = isSameNft(author, currentNftId);
            const isConsecutive = isSameNft(author, messages[index - 1]?.nft);
            const showTime =
              hasMintuesChanged(
                message.created_at,
                messages[index - 1]?.created_at,
              ) || !isConsecutive;
            const showAuthor = hasMintuesChanged(
              message.created_at,
              messages[index + 1]?.created_at,
            );
            const showDate = hasDateChanged(
              message.created_at,
              messages[index + 1]?.created_at,
            );
            return (
              <MessageMemo
                key={message._id.$oid}
                text={message.text}
                avatar={message.avatar}
                createdAt={message.created_at}
                readNftIdLength={message.read_nft_ids.length}
                isMine={isMine}
                numNfts={numNfts}
                showTime={showTime}
                showAuthor={showAuthor}
                showDate={showDate}
                roomName={roomName}
              />
            );
          }}></FlatList>
        <NewMessage
          text={text}
          onTextChange={handleTextChange}
          onPressSend={sendMessage}
        />
      </KeyboardAvoidingView>
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </>
  );
}

const Message = ({
  text,
  avatar,
  isMine,
  numNfts,
  createdAt,
  readNftIdLength,
  showTime,
  showAuthor,
  showDate,
  roomName,
}) => {
  const unreadCount = numNfts - readNftIdLength;
  return (
    <>
      <Row
        px15
        {...(isMine && {style: {flexDirection: 'row-reverse'}})}
        my2
        mb12={showTime}
        itemsStart>
        {!isMine && (
          <Col auto w32 h32 px0>
            {showAuthor && <Img rounded100 uri={avatar} h32 w32 />}
          </Col>
        )}
        <Col auto={!isMine} style={{flex: 3, wordBreak: 'break-all'}}>
          {showAuthor && !isMine && (
            <Row itemsEnd>
              <Col auto px8 pb8>
                <Span fontSize={14} medium>
                  {roomName}
                </Span>
              </Col>
              <Col></Col>
            </Row>
          )}
          <Row
            {...(isMine && {style: {flexDirection: 'row-reverse'}})}
            itemsEnd>
            <Col
              bgGray100={!isMine}
              bgPrimary={isMine}
              rounded30
              p8
              px16
              mx10
              mr0={isMine}
              maxW={(DEVICE_WIDTH - 30) / 2}
              auto>
              <Span fontSize={16} white={isMine}>
                {text}
              </Span>
            </Col>
            {unreadCount > 0 && (
              <Col auto pl8={isMine} pr8={!isMine}>
                <Span primary>{unreadCount}</Span>
              </Col>
            )}
            <Col itemsEnd={isMine} auto>
              {showTime && (
                <Span gray700 fontSize={12}>
                  {kmoment(createdAt).format('a h:mm')}
                </Span>
              )}
            </Col>
          </Row>
        </Col>
        <Col style={{flex: 1}}></Col>
      </Row>
      {showDate && (
        <Div itemsCenter py16>
          <Div rounded100 bgRealBlack>
            <Span py8 px16 white>
              {getCalendarDay(createdAt)}
            </Span>
          </Div>
        </Div>
      )}
    </>
  );
};
const MessageMemo = React.memo(Message);

export default ChatRoomScreen;
