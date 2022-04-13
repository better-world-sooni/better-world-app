import React, {useCallback, useEffect, useState} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {FlatList, View} from 'src/modules/viewComponents';
import {shallowEqual, useSelector} from 'react-redux';
import {GRAY_COLOR} from 'src/modules/constants';
import {Grid} from 'react-native-feather';
import {RootState} from 'src/redux/rootReducer';
import {Header} from 'src/components/Header';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {NAV_NAMES} from 'src/modules/navNames';
import {getPromiseFn, useApiSelector, useReloadGET} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ChatRoomItem from 'src/components/ChatRoomItem';
import {cable} from 'src/modules/cable';
import {ChatChannel} from 'src/components/ChatChannel'

const NoChatRooms = () => {
  const navigation = useNavigation();
  return (
    <>
      <Row
        itemsCenter
        justifyCenter
        pt20
        pb10
        onPress={() => navigation.navigate(NAV_NAMES.Metaverse)}>
        <Col h2 />
        <Col auto>
          <Grid
            height={50}
            width={50}
            strokeWidth={0.7}
            color={GRAY_COLOR}></Grid>
        </Col>
        <Col h2></Col>
      </Row>
      <Row pb20>
        <Col></Col>
        <Col auto>
          <Span color={GRAY_COLOR}>
            메타순간 탭에 들어가서 말풍선이 있는 유저를 눌러 보세요!
          </Span>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
};
const ChatRoomsLoading = () => {
  return (
    <>
      <Row px20>
        <SkeletonPlaceholder>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View style={{marginLeft: 20}}>
              <View
                style={{
                  width: 80,
                  height: 15,
                  borderRadius: 4,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
              <View
                style={{
                  width: 200,
                  height: 15,
                  borderRadius: 4,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View style={{marginLeft: 20}}>
              <View
                style={{
                  width: 80,
                  height: 15,
                  borderRadius: 4,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
              <View
                style={{
                  width: 200,
                  height: 15,
                  borderRadius: 4,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            </View>
          </View>
        </SkeletonPlaceholder>
      </Row>
    </>
  );
};

const ChatScreen = () => {
  const {token, currentUser} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const userUuid = currentUser?.uuid;
  const {data: chatRoomsResponse, isLoading: chatRoomLoading} = useApiSelector(
    APIS.chat.chatRoom.main,
  );
  const [chatRooms, setChatRooms] = useState(chatRoomsResponse?.chat_rooms);

  const updateList = useCallback((newmsg) => {
    let list = [...chatRooms];
    let roomId = newmsg['room_id'];
    let index = list.findIndex(x=>x.room.id === roomId);
    list.splice(0, 0, list.splice(index, 1)[0]);
    list[0].last_message = newmsg['text'];
    list[0].unread_count += 1;
    return list;
  }, [chatRooms]);

  useFocusEffect(
    useCallback(() => {
      let channel;
      const wsConnect = async () => {
        channel = new ChatChannel({userUuid: userUuid});
        await cable(token).subscribe(channel);
        const res = await getPromiseFn({
          url: APIS.chat.chatRoom.main().url,
          token,
        });
        if (res?.data) {
          const {chat_rooms} = res.data;
          setChatRooms(chat_rooms);
        }
        channel.on('message', res => {
          console.log("list receive", res['data'])
          setChatRooms([... updateList(res['data'])])
        });
        channel.on('close', () => console.log('Disconnected list socket connection'));
        channel.on('disconnect', () => channel.send('Dis'));
      };
      wsConnect()
      return () => {
        channel.disconnect();
        channel.close();
      }
    },[])
  );

  return (
    <Div flex bg={'white'}>
      <Header bg={'rgba(255,255,255,0)'} headerTitle={'채팅'} />
      <FlatList
        flex={1}
        showsVerticalScrollIndicator={false}
        data={chatRooms}
        ListEmptyComponent={<NoChatRooms />}
        renderItem={({item, index}) => {
          const chatRoomId = item.room.id;
          const category = item.room.category;
          const createdAt = item.room.created_at;
          const title = item.room.name;
          const lastMessage = item.last_message;
          const numUsers = item.num_users;
          const unreadMessageCount = item.unread_count;
          const firstUserAvatar = item.profile_imgs[0];
          const secondUserAvatar = item.profile_imgs[1];
          const thirdUserAvatar = item.profile_imgs[2];
          const fourthUserAvatar = item.profile_imgs[3];
          return (
            <ChatRoomItem
              chatRoomId={chatRoomId}
              category={category}
              createdAt={createdAt}
              title={title}
              numUsers = {numUsers}
              unreadMessageCount={unreadMessageCount}
              lastMessage={lastMessage}
              firstUserAvatar={firstUserAvatar}
              secondUserAvatar={secondUserAvatar}
              thirdUserAvatar={thirdUserAvatar}
              fourthUserAvatar={fourthUserAvatar}
            />
          );
        }}
      />
    </Div>
  );
};

export default ChatScreen;
