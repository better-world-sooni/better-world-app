import React, {useState} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {ScrollView, View} from 'src/modules/viewComponents';
import {shallowEqual, useSelector} from 'react-redux';
import {GRAY_COLOR, HAS_NOTCH} from 'src/modules/constants';
import {Grid} from 'react-native-feather';
import {RootState} from 'src/redux/rootReducer';
import {Header} from 'src/components/Header';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {NAV_NAMES} from 'src/modules/navNames';
import {getPromiseFn} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import moment from 'moment';
import 'moment/locale/ko';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ChatRoomItem from 'src/components/ChatRoomItem';
moment.locale('ko');

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
  const {currentUser, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [chatRooms, setChatRooms] = useState([]);
  const fetchNewRoom = async () => {
    const res = await getPromiseFn({
      url: APIS.chat.chatRoom.main(currentUser.id).url,
      token,
    });
    if (res?.data) {
      const {chatRooms} = res.data;
      setChatRooms(chatRooms);
    }
  };

  useFocusEffect(() => {
    fetchNewRoom();
  });

  return (
    <Div flex bg={'white'}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Header bg={'rgba(255,255,255,0)'} />
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <Div pb10>
          {chatRooms.map(chatRoom => {
            const chatRoomId = chatRoom.id;
            const userIds = chatRoom.userIds.length;
            const createdAt = chatRoom.lastMessage?.createdAt;
            const title = chatRoom.title;
            const lastMessage = chatRoom.lastMessage?.text;
            return (
              <ChatRoomItem
                chatRoomId={chatRoomId}
                userIds={userIds}
                createdAt={createdAt}
                title={title}
                lastMessage={lastMessage}
              />
            );
          })}
          {chatRooms.length == 0 && <NoChatRooms />}
        </Div>
      </ScrollView>
    </Div>
  );
};

export default ChatScreen;
