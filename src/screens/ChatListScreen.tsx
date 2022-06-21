import {useNavigation, useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useEffect, useState, useRef, memo} from 'react';
import {Alert, RefreshControl} from 'react-native';
import {ChevronLeft, CornerDownLeft, Search} from 'react-native-feather';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {Manager} from 'socket.io-client';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {Img} from 'src/components/common/Img';
import apis from 'src/modules/apis';
import {getPromiseFn, useApiSelector, asyncActions, getKeyByApi} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {cable} from 'src/modules/cable';
import {ChatChannel} from 'src/components/ChatChannel';
import ChatRoomAvatars from 'src/components/ChatRoomAvatars';
import TruncatedText from 'src/components/common/TruncatedText';
import {HAS_NOTCH, kmoment} from 'src/modules/constants';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {BlurView} from '@react-native-community/blur';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {createdAtText} from 'src/modules/timeUtils';
import {useGotoChatRoomFromList} from 'src/hooks/useGoto';
import {ChatRoomEnterType} from './ChatRoomScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {resizeImageUri} from 'src/modules/uriUtils';

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
  const [isEntered, setIsEntered] = useState(false);
  const updateListRef = useRef(null);
  const chatRoomsRef = useRef(null);

  const dispatch = useDispatch();
  const {goBack} = useNavigation();
  const gotoChatRoom = useGotoChatRoomFromList();

  const currentNftId = {
    token_id: currentNft.token_id,
    contract_address: currentNft.contract_address,
  };

  const inRoomSetIsEntered = useCallback((bool) => {
    setIsEntered(bool)
  }, [setIsEntered]);

  const inRoomUnreadCountUpdate = useCallback((roomId) => {
    const index = chatRooms.findIndex(x => x.room_id === roomId);
    const room = Object.assign({}, chatRooms[index]);
    room.unread_count = 0;
    setChatRooms(prev => [...prev.slice(0, index), room, ...prev.slice(index+1)])
  }, [chatRooms, setChatRooms])

  const inRoomMessageUpdate = useCallback((roomId, msg) => {
    const index = chatRooms.findIndex(x => x.room_id === roomId);
    const room = Object.assign({}, chatRooms[index]);
    room.last_message = msg.text;
    room.updated_at = msg.created_at;
    setChatRooms(prev => [room, ...prev.slice(0, index), ...prev.slice(index+1)])
  }, [chatRooms, setChatRooms])

  // const updateList = useCallback((newRoom)=> {
  //   console.log("hihi")
  //   console.log(chatSocket)
  //   const index = chatRooms.findIndex(x => x.room_id === newRoom.room_id);
  //   newRoom.unread_count = 1;
  //   if (index > -1) {
  //     if (chatSocket) chatSocket.newRoomOpen(newRoom.room_id);
  //     newRoom.unread_count = chatRooms[index].unread_count + 1;
  //     newRoom.room_profile_imgs = chatRooms[index].room_profile_imgs;
  //     setChatRooms(prev => [newRoom, ...prev.filter((_, i) => i != index)]);
  //   } else {
  //     setChatRooms(prev => [newRoom, ...prev]);
  //   }
  // }, [chatRooms, chatSocket, setChatRooms])


  useEffect(() => {
    const updateList = newRoom => {
      if(!isEntered) {
        const index = chatRooms.findIndex(x => x.room_id === newRoom.room_id);
        newRoom.unread_count = 1;
        if (index > -1) {        
          newRoom.unread_count = chatRooms[index].unread_count + 1;
          newRoom.room_image = chatRooms[index].room_image;
          setChatRooms(prev => [newRoom, ...prev.filter((_, i) => i != index)]);
        } else {
          if (chatSocket) chatSocket.newRoomOpen(newRoom.room_id);
          setChatRooms(prev => [newRoom, ...prev]);
        }
      }
    };
    updateListRef.current = updateList;
    chatRoomsRef.current = chatRooms;
  }, [chatRooms, chatSocket, isEntered]);

  useEffect(() => {
    const channel = new ChatChannel(currentNftId);
    const wsConnect = async () => {
      await cable(token).subscribe(channel);
      setChatSocket(channel);
      channel.on('fetch', res => {
        setChatRooms(res['data']);
      });
      channel.on('message', res => {
        updateListRef.current(res['room']);
      });
      channel.on('close', () => console.log('Disconnected from chat'));
      channel.on('disconnect', () => console.log('check disconnect'));
    };
    wsConnect();
    channel.fetchList();
    return () => {
      if (channel) {
        channel.disconnect();
        channel.close();
      }
      dispatch(asyncActions.update({
        key: getKeyByApi(apis.chat.chatRoom.all()),
        data: {
          success: true,
          chat_list_data: chatRoomsRef.current,
        }
      }))
    };
  }, [currentNft])

  useEffect(() => {
    if (chatListRes) {
      setChatRooms(chatListRes.chat_list_data);
    }
  }, [chatListRes]);


  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  return (
    <Div flex={1} bgWhite>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        ListEmptyComponent={
          <Div>
            <Row py15>
              <Col></Col>
              <Col auto>
                <Span>채팅 기록이 없습니다.</Span>
              </Col>
              <Col></Col>
            </Row>
          </Div>
        }
        ListHeaderComponent={
          <>
            <Div h={headerHeight} zIndex={100}>
              <Animated.View style={headerStyles}>
                <CustomBlurView
                  blurType="xlight"
                  blurAmount={30}
                  blurRadius={20}
                  overlayColor=""
                  style={{
                    width: DEVICE_WIDTH,
                    height: '100%',
                    position: 'absolute',
                  }}
                  reducedTransparencyFallbackColor="white"></CustomBlurView>
              </Animated.View>
              <Row
                itemsCenter
                py5
                h40
                p8
                zIndex={100}
                absolute
                w={DEVICE_WIDTH}
                top={notchHeight + 5}>
                <Col itemsStart></Col>
                <Col auto>
                  <Span bold fontSize={19}>
                    채팅
                  </Span>
                </Col>
                <Col />
              </Row>
            </Div>
          </>
        }
        stickyHeaderIndices={[0]}
        data={chatRooms}
        renderItem={({item, index}) => {
          return (
            <ChatRoomItemMemo
              key={index}
              onPress={(roomName, roomImage, roomId) =>
                gotoChatRoom(roomName, roomImage, roomId, inRoomSetIsEntered, inRoomUnreadCountUpdate, inRoomMessageUpdate)
              }
              room={item}
            />
          );
        }}></Animated.FlatList>
    </Div>
  );
}


const ChatRoomItemMemo = memo(ChatRoomItem)
function ChatRoomItem({onPress, room}) {
  const roomId = room.room_id;
  const updatedAt = room.updated_at;
  const roomName = room.room_name;
  const unreadMessageCount = room.unread_count;
  const lastMessage = room.last_message;
  const roomImage = room.room_image;

  return (
    <Div px15>
      <Row
        bgWhite
        onPress={() => onPress(roomName, roomImage, roomId)}
        py5
        cursorPointer
        itemsCenter>
        <Col auto relative mr10>
          <Div rounded100 overflowHidden h50>
            <Img uri={resizeImageUri(roomImage, 200, 200)} w50 h50></Img>
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
                {lastMessage && <TruncatedText text={lastMessage} maxLength={30} />}
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
