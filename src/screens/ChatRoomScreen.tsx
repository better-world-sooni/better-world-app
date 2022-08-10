import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {Alert, FlatList, Platform, ActivityIndicator} from 'react-native';
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
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {KeyboardAvoidingView} from 'src/components/common/ViewComponents';
import {Img} from 'src/components/common/Img';
import NewMessage from 'src/components/common/NewMessage';
import {getCalendarDay, kmoment} from 'src/utils/timeUtils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getNftProfileImage, getNftName} from 'src/utils/nftUtils';
import {resizeImageUri} from 'src/utils/uriUtils';
import {HAS_NOTCH} from 'src/modules/constants';
import { EventRegister } from 'react-native-event-listeners'
import {useGotoNftProfile} from 'src/hooks/useGoto';

export enum ChatRoomEnterType {
  List,
  Profile,
  Notification,
}

function ChatRoomScreen({
  route: {
    params: {roomId, roomName, roomImage, opponentNft, chatRoomEnterType},
  },
}) {
  const {currentNft, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {data: chatRoomRes, isLoading: chatRoomLoad} = useApiSelector(
    chatRoomEnterType == ChatRoomEnterType.Profile
      ? apis.chat.chatRoom.contractAddressAndTokenId(
          opponentNft.contract_address,
          opponentNft.token_id,
        )
      : apis.chat.chatRoom.roomId(roomId),
  );
  const currentNftId = {
    token_id: currentNft.token_id,
    contract_address: currentNft.contract_address,
  };
  const currentAvatar = useMemo(
    () => getNftProfileImage(currentNft, 200, 200),
    [currentNft],
  );
  const opponentAvatar = useMemo(
    () => resizeImageUri(roomImage, 200, 200),
    [roomImage],
  );
  const currentNftImage = useMemo(
    () => getNftProfileImage(currentNft),
    [currentNft],
  );
  const currentNftName = useMemo(() => getNftName(currentNft), [currentNft]);

  const [chatSocket, setChatSocket] = useState(null);
  const [enterNfts, setEnterNfts] = useState([]);
  const [connectRoomId, setConnectRoomId] = useState(
    roomId ? roomId : chatRoomRes ? chatRoomRes.room_id : null,
  );
  const [messages, setMessages] = useState(
    chatRoomRes ? chatRoomRes.init_messages : [],
  );
  const [page, setPage] = useState(chatRoomRes ? chatRoomRes.init_messages : 1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [text, setText] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const readCountUpdateRef = useRef(null);
  const flatListRef = useRef(null);
  const {goBack} = useNavigation();

  useEffect(() => {
    if (connectRoomId) {
      const channel = new ChatChannel({roomId: connectRoomId});
      const wsConnect = async () => {
        await cable(token).subscribe(channel);
        setChatSocket(channel);
        channel.on('enter', res => {
          setEnterNfts(res.entered_nfts);
          setChatReady(true);
          if (
            currentNftId.token_id != res.enter_nft.token_id ||
            currentNftId.contract_address != res.enter_nft.contract_address
          ) {
            const updateMsgLength = res.update_msgs.length;
            setMessages(prevMsgs => [
              ...res.update_msgs,
              ...prevMsgs.slice(updateMsgLength),
            ]);
          }
        });
        channel.on('nextPageMessage', res => {
          const msgs_length = res.messages.length;
          setPageLoading(false);
          if (msgs_length == 0) {
            setIsLastPage(true);
          } else if (msgs_length == 20) {
            setMessages(prevMsgs => [...prevMsgs, ...res.messages]);
            setPage(p => p + 1);
          } else {
            setMessages(prevMsgs => [...prevMsgs, ...res.messages]);
            setPage(p => p + 1);
            setIsLastPage(true);
          }
        });
        channel.on('messageRoom', res => {
          setMessages(m => [res.message, ...m]);
        });
        channel.on('leave', res => {
          setEnterNfts(prevNfts => [
            ...prevNfts.filter(
              nft =>
                nft.token_id != res.leave_nft.token_id ||
                nft.contract_address != res.leave_nft.contract_address,
            ),
          ]);
        });
      };
      wsConnect();
      channel.enter();
      return () => {
        setChatReady(false);
        if (channel) {
          channel.disconnect();
          channel.close();
        }
      };
    }
  }, [connectRoomId]);

  useEffect(() => {
    if (chatRoomRes) {
      setMessages(chatRoomRes.init_messages);
      setConnectRoomId(chatRoomRes.room_id);
      setPage(chatRoomRes.init_page);
      if (chatRoomEnterType !== ChatRoomEnterType.List) {
        EventRegister.emit('roomUnreadCountUpdate', chatRoomRes.room_id);
      }
    }
  }, [chatRoomRes]);

  const handleTextChange = useCallback(text => {
    setText(text);
  }, []);

  const sendMessage = useCallback(async () => {
    if (chatSocket) {
      const Timestamp = new Date();
      const msg = {
        text: text,
        nft: currentNftId,
        read_nft_ids: enterNfts,
        created_at: Timestamp,
        updated_at: Timestamp,
      };
      const myRoom = {
        room_id: connectRoomId,
        updated_at: Timestamp,
        room_name: roomName,
        room_image: roomImage,
        last_message: text,
      };
      const opponentRoom = {
        room_id: connectRoomId,
        updated_at: Timestamp,
        room_name: currentNftName,
        room_image: currentNftImage,
        last_message: text,
      };
      chatSocket.send(msg, myRoom, opponentRoom, opponentNft);
    } else Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
    setText('');
  }, [
    currentNft,
    currentNftName,
    currentNftImage,
    connectRoomId,
    chatSocket,
    text,
    enterNfts,
  ]);

  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
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

  const onEndReached = useCallback(() => {
    if (pageLoading || isLastPage) {
      return;
    } else {
      if (chatSocket?.state === 'connected') {
        setPageLoading(true);
        chatSocket.nextPage(page);
      }
    }
  }, [chatSocket, page, isLastPage, pageLoading, setPageLoading]);
  const notchBottom = useSafeAreaInsets().bottom;

  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight} bgWhite></Div>
      <Div
        bgWhite
        px15
        h={50}
        justifyCenter
        borderBottom={0.5}
        borderGray200
        zIndex={100}>
        <Row itemsCenter>
          <Col justifyStart mr10>
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color={Colors.black}
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={17}>
              {roomName}
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <KeyboardAvoidingView
        flex={1}
        bgWhite
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          contentInset={{bottom: 5, top: 5}}
          inverted
          onEndReached={onEndReached}
          onEndReachedThreshold={Platform.OS == 'ios' ? 0 : 0.8}
          ListFooterComponent={pageLoading && <ActivityIndicator />}
          ListEmptyComponent={chatRoomLoad && <ActivityIndicator />}
          data={!chatRoomLoad && messages}
          initialNumToRender={20}
          keyExtractor={item => item._id.$oid}
          renderItem={({item: message, index}) => {
            const author = (message as any).nft;
            const isMine = isSameNft(author, currentNftId);
            const isConsecutiveForward = isSameNft(
              author,
              messages[index - 1]?.nft,
            );
            const isConsecutiveBackward = isSameNft(
              author,
              messages[index + 1]?.nft,
            );
            const showTime =
              hasMintuesChanged(
                message.created_at,
                messages[index - 1]?.created_at,
              ) || !isConsecutiveForward;
            const showAuthor =
              hasMintuesChanged(
                message.created_at,
                messages[index + 1]?.created_at,
              ) || !isConsecutiveBackward;
            const showDate = hasDateChanged(
              message.created_at,
              messages[index + 1]?.created_at,
            );
            return (
              <MessageMemo
                key={message._id.$oid}
                text={message.text}
                avatar={isMine ? currentAvatar : opponentAvatar}
                createdAt={message.created_at}
                readNftIdLength={message.read_nft_ids.length}
                isMine={isMine}
                showTime={showTime}
                showAuthor={showAuthor}
                showDate={showDate}
                roomName={roomName}
              />
            );
          }}
        />
        <NewMessage
          text={text}
          onTextChange={handleTextChange}
          onPressSend={sendMessage}
          roomLoading={chatRoomLoad}
          ready={chatReady}
        />
      </KeyboardAvoidingView>
      <Div h={notchBottom} bgWhite></Div>
    </Div>
  );
}

const Message = ({
  text,
  avatar,
  isMine,
  createdAt,
  readNftIdLength,
  showTime,
  showAuthor,
  showDate,
  roomName,
}) => {
  const unreadCount = 2 - readNftIdLength;
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
        <Col auto={!isMine} style={{flex: 7, wordBreak: 'break-all'}}>
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
              bgSecondary={isMine}
              rounded20
              p10
              px16
              mx10
              mr0={isMine}
              maxW={(DEVICE_WIDTH - 30) / 1.5}
              auto>
              <Span fontSize={15} white={isMine}>
                {text}
              </Span>
            </Col>
            {unreadCount > 0 && (
              <Col auto pl8={isMine} pr8={!isMine}>
                <Span info>{unreadCount}</Span>
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
          <Div rounded100>
            <Span py8 px16 bold>
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
