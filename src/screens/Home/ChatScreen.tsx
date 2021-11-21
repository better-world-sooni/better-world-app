import React, {useEffect, useState} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {ScrollView, View} from 'src/modules/viewComponents';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  GRAY_COLOR,
  HAS_NOTCH,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
} from 'src/modules/constants';
import {Grid, MessageCircle} from 'react-native-feather';
import {Input, NativeBaseProvider} from 'native-base';
import {RootState} from 'src/redux/rootReducer';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {Header} from 'src/components/Header';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {NAV_NAMES} from 'src/modules/navNames';
import {setCurrentChatRoomId} from 'src/redux/chatReducer';
import {Swipeable} from 'react-native-gesture-handler';
import useSocketInput from 'src/hooks/useSocketInput';
import {
  getPromiseFn,
  patchPromiseFn,
  postPromiseFn,
} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import moment from 'moment';
import 'moment/locale/ko';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
moment.locale('ko');

const NoChatRooms = () => {
  const navigation = useNavigation();
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
const RightSwipeActions = () => {
  return (
    <Div flex={1} bg={'red'} justifyCenter itemsEnd>
      <Span color={'#40394a'} px={20} medium>
        채팅방 나가기
      </Span>
    </Div>
  );
};

const ChatScreen = () => {
  const {currentUser, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const goToChatRoom = roomId => {
    navigation.navigate(NAV_NAMES.ChatRoom, {currentChatRoomId: roomId});
  };
  const exitChatRoom = async roomId => {
    const res = await patchPromiseFn({
      url: APIS.chat.chatRoom.user().url,
      body: {
        userId: currentUser.id,
        chatRoomId: roomId,
      },
      token,
    });
    if (res.ok && res.data?.chatRooms) {
      setChatRooms(res.data.chatRooms);
    }
  };

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
      <Header bg={'rgba(255,255,255,0)'} noFilter={true} />
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <NativeBaseProvider>
          <Div relative>
            <Div pb10>
              {chatRooms.map(chatRoom => {
                return (
                  <Swipeable
                    key={chatRoom.id}
                    renderRightActions={RightSwipeActions}
                    onSwipeableRightOpen={() => exitChatRoom(chatRoom.id)}>
                    <Row
                      px20
                      py10
                      flex
                      onPress={() => goToChatRoom(chatRoom.id)}
                      bgWhite>
                      <Col auto mr5 relative>
                        <MessageCircle
                          color={'black'}
                          height={50}
                          width={50}
                          strokeWidth={1}></MessageCircle>
                      </Col>
                      <Col justifyCenter ml10>
                        <Row>
                          <Col auto pr10>
                            <Span fontSize={15} bold>
                              {chatRoom.title}
                            </Span>
                          </Col>
                          <Col auto>
                            <Span
                              color={
                                GRAY_COLOR
                              }>{`${chatRoom.userIds.length}명`}</Span>
                          </Col>
                        </Row>
                        <Row w={'100%'}>
                          <Col auto>
                            <Span fontSize={15}>
                              {chatRoom.lastMessage?.text}
                            </Span>
                          </Col>
                          <Col />
                          <Col auto>
                            <Span fontSize={13} light>
                              {moment(
                                chatRoom.lastMessage?.createdAt,
                              ).calendar()}
                            </Span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Swipeable>
                );
              })}
              {chatRooms.length == 0 && <NoChatRooms />}
            </Div>
          </Div>
        </NativeBaseProvider>
      </ScrollView>
    </Div>
  );
};

export default ChatScreen;
