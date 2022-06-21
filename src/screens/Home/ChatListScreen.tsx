import {useNavigation, useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {RefreshControl} from 'react-native';
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
import ChatRoomAvatars from 'src/components/ChatRoomAvatars';
import TruncatedText from 'src/components/common/TruncatedText';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {createdAtText} from 'src/modules/timeUtils';
import {useGotoChatRoomFromList} from 'src/hooks/useGoto';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlatList} from 'native-base';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';

function ChatListScreen() {
  const {data: chatListRes, isLoading: chatListLoad} = useApiSelector(
    apis.chat.chatRoom.all,
  );
  const {currentNft, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {goBack} = useNavigation();
  const gotoChatRoom = useGotoChatRoomFromList();
  const currentNftId = {
    token_id: currentNft.token_id,
    contract_address: currentNft.contract_address,
  };
  const [chatRooms, setChatRooms] = useState(chatListRes?.chat_rooms || []);
  const [chatSocket, setChatSocket] = useState(null);
  const updateListRef = useRef(null);

  useEffect(() => {
    if (chatListRes) {
      setChatRooms(chatListRes.chat_rooms);
    }
  }, [chatListRes]);

  useEffect(() => {
    const updateList = newRoom => {
      const index = chatRooms.findIndex(x => x.room_id === newRoom.room_id);
      newRoom.unread_count = 1;
      if (index > -1) {
        if (chatSocket) chatSocket.newRoomOpen(newRoom.room_id);
        newRoom.unread_count = chatRooms[index].unread_count + 1;
        newRoom.room_profile_imgs = chatRooms[index].room_profile_imgs;
        setChatRooms(prev => [newRoom, ...prev.filter((_, i) => i != index)]);
      } else {
        setChatRooms(prev => [newRoom, ...prev]);
      }
    };
    updateListRef.current = updateList;
  }, [chatRooms]);

  useFocusEffect(
    useCallback(() => {
      const channel = new ChatChannel(currentNftId);
      const wsConnect = async () => {
        await cable(token).subscribe(channel);
        setChatSocket(channel);
        channel.on('fetch', res => {
          setChatRooms(res['data']);
        });
        let _ = await channel.fetchList();
        channel.on('message', res => {
          updateListRef.current(res['room']);
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
    }, [currentNft]),
  );

  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <FlatList
        ListHeaderComponent={
          <Div
            bgWhite
            px15
            h={50}
            justifyCenter
            borderBottom={0.5}
            borderGray200>
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
        }
        // stickyHeaderIndices={[0]}
        // @ts-ignore
        stickyHeaderHiddenOnScroll
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
        }
        refreshControl={<RefreshControl refreshing={chatListLoad} />}
        data={chatRooms}
        renderItem={({item, index}) => {
          return (
            <ChatRoomItem
              key={index}
              onPress={(roomName, roomImage, roomId) =>
                gotoChatRoom(roomName, roomImage, roomId)
              }
              room={item}
            />
          );
        }}></FlatList>
    </Div>
  );
}

function ChatRoomItem({onPress, room}) {
  const roomId = room.room_id;
  const updatedAt = room.updated_at;
  const roomName = room.room_name;
  const unreadMessageCount = room.unread_count;
  const lastMessage = room.last_message;
  const profileImgArr = room.room_profile_imgs;

  return (
    <Div px15>
      <Row
        bgWhite
        onPress={() => onPress(roomName, profileImgArr, roomId)}
        py5
        cursorPointer
        itemsCenter>
        <Col auto relative mr10>
          <Div rounded100 overflowHidden h50>
            <ChatRoomAvatars
              firstUserAvatar={profileImgArr[0]}
              secondUserAvatar={profileImgArr[1]}
            />
          </Div>
        </Col>
        <Col>
          <Row itemsCenter>
            <Col auto mr10>
              <Span fontSize={15} medium>
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
                <TruncatedText text={lastMessage} maxLength={30} />
              </Div>
            </Col>
          </Row>
        </Col>
        {unreadMessageCount > 0 && (
          <Col auto rounded100 bgDanger px8 py4 justifyCenter>
            <Span white fontSize={12} medium>
              {unreadMessageCount >= 100 ? '99+' : unreadMessageCount}
            </Span>
          </Col>
        )}
      </Row>
    </Div>
  );
}

export default ChatListScreen;
