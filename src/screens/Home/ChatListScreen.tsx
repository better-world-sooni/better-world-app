import {useFocusEffect} from '@react-navigation/core';
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  memo,
  useMemo,
} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {Img} from 'src/components/common/Img';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  asyncActions,
  getKeyByApi,
} from 'src/redux/asyncReducer';
import {appActions} from 'src/redux/appReducer';
import {RootState} from 'src/redux/rootReducer';
import {cable} from 'src/modules/cable';
import {ChatChannel} from 'src/components/ChatChannel';
import TruncatedText from 'src/components/common/TruncatedText';
import {DEVICE_HEIGHT} from 'src/modules/styles';
import {createdAtText} from 'src/utils/timeUtils';
import {useGotoChatRoomFromList} from 'src/hooks/useGoto';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {resizeImageUri} from 'src/utils/uriUtils';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';
import {FlatList} from 'react-native';

function ChatListScreen() {
  const {currentNft, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {data: chatListRes, isLoading: chatListLoad} = useApiSelector(
    apis.chat.chatRoom.all,
  );

  const [chatRooms, setChatRooms] = useState(
    chatListRes ? chatListRes.chat_list_data : [],
  );
  const [chatSocket, setChatSocket] = useState(null);
  const updateListRef = useRef(null);
  const chatRoomsRef = useRef(null);

  const dispatch = useDispatch();
  const gotoChatRoom = useGotoChatRoomFromList();

  const currentNftId = {
    token_id: currentNft.token_id,
    contract_address: currentNft.contract_address,
  };

  type ListObject = {
    room_id: string;
    room_image: string;
    room_name: string;
    opponent_nft: Object;
    unread_count: number;
    last_message: string;
    updated_at: string;
  };

  useEffect(() => {
    if (chatListRes) {
      setChatRooms(chatListRes.chat_list_data);
      dispatch(
        appActions.updateUnreadChatRoomCount({
          unreadChatRoomCount: chatListRes.total_unread,
        }),
      );
    }
  }, [chatListRes]);

  useFocusEffect(
    useCallback(() => {
      if (chatSocket?.state === 'connected') chatSocket.fetchList();
    }, [chatSocket]),
  );

  useEffect(() => {
    const channel = new ChatChannel(currentNftId);
    const wsConnect = async () => {
      await cable(token).subscribe(channel);
      setChatSocket(channel);
      channel.on('fetchList', res => {
        setChatRooms(res.data.list_data);
        dispatch(
          appActions.updateUnreadChatRoomCount({
            unreadChatRoomCount: res.data.total_unread,
          }),
        );
      });
      channel.on('messageList', res => {
        updateListRef.current(res.room, res.read);
      });
    };
    wsConnect();

    return () => {
      if (channel) {
        channel.disconnect();
        channel.close();
      }
      dispatch(
        asyncActions.update({
          key: getKeyByApi(apis.chat.chatRoom.all()),
          data: {
            success: true,
            chat_list_data: chatRoomsRef.current,
          },
        }),
      );
    };
  }, [currentNft]);

  useEffect(() => {
    const updateList = (room, read) => {
      const index = chatRooms.findIndex(x => x.room_id === room.room_id);
      if (index > -1) {
        if (!read) {
          if (chatRooms[index].unread_count == 0) {
            dispatch(appActions.incrementUnreadChatRoomCount({deltum: 1}));
          }
          room.unread_count = chatRooms[index].unread_count + 1;
        } else room.unread_count = 0;
        setChatRooms(prev => [room, ...prev.filter((_, i) => i != index)]);
      } else {
        if (!read) {
          room.unread_count = 1;
          dispatch(appActions.incrementUnreadChatRoomCount({deltum: 1}));
        } else room.unread_count = 0;
        setChatRooms(prev => [room, ...prev]);
      }
    };
    updateListRef.current = updateList;
    chatRoomsRef.current = chatRooms;
  }, [chatRooms, chatSocket]);

  const readCountRefresh = useCallback(
    roomId => {
      const index = chatRooms.findIndex(x => x.room_id === roomId);
      if (chatRooms[index].unread_count > 0) {
        const room = Object.assign({}, chatRooms[index]);
        room.unread_count = 0;
        setChatRooms(prev => [
          ...prev.slice(0, index),
          room,
          ...prev.slice(index + 1),
        ]);
        dispatch(appActions.incrementUnreadChatRoomCount({deltum: -1}));
      }
    },
    [chatRooms, setChatRooms],
  );

  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <Div bgWhite px15 h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40 p8 zIndex={100}>
          <Col itemsStart></Col>
          <Col auto>
            <Span bold fontSize={19}>
              채팅
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
        }
        data={chatRooms as Array<ListObject>}
        renderItem={({item, index}) => {
          return (
            <ChatRoomItemMemo
              key={index}
              onPress={() => {
                readCountRefresh(item.room_id);
                gotoChatRoom(
                  item.room_id,
                  item.room_name,
                  item.room_image,
                  item.opponent_nft,
                );
              }}
              room={item}
            />
          );
        }}></FlatList>
    </Div>
  );
}

const ChatRoomItemMemo = memo(ChatRoomItem);
function ChatRoomItem({onPress, room}) {
  const roomId = room.room_id;
  const updatedAt = room.updated_at;
  const roomName = room.room_name;
  const unreadMessageCount = room.unread_count;
  const text =
    unreadMessageCount > 0
      ? `새 메세지 ${unreadMessageCount}개`
      : room.last_message;
  const roomImage = room.room_image;
  const imgUri = useMemo(
    () => resizeImageUri(room.room_image, 200, 200),
    [roomImage],
  );

  return (
    <Div px15>
      <Row bgWhite onPress={() => onPress()} py5 cursorPointer itemsCenter>
        <Col auto relative mr10>
          <Div rounded100 overflowHidden h50>
            <Img uri={imgUri} w50 h50></Img>
          </Div>
        </Col>
        <Col pl5>
          <Row itemsCenter>
            <Col auto mr10>
              <Span fontSize={15} bold>
                {roomName}
              </Span>
            </Col>
            <Col auto>
              <Span fontSize={13} gray700>
                {createdAtText(updatedAt)}
              </Span>
            </Col>
          </Row>
          <Row w={'100%'} pt2>
            <Col pr10>
              <Div>
                {text && (
                  <TruncatedText
                    spanProps={{...(unreadMessageCount > 0 && {bold: true})}}
                    text={text}
                    maxLength={30}
                  />
                )}
              </Div>
            </Col>
          </Row>
        </Col>
        {unreadMessageCount > 0 && (
          <Col auto rounded100 bgInfo p4 justifyCenter />
        )}
      </Row>
    </Div>
  );
}

export default ChatListScreen;
