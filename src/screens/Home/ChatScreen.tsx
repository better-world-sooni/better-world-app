import React, {useEffect, useState} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {ScrollView} from 'src/modules/viewComponents';
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
import {useNavigation} from '@react-navigation/core';
import {NAV_NAMES} from 'src/modules/navNames';
import {setCurrentChatRoomId} from 'src/redux/chatReducer';
import {Swipeable} from 'react-native-gesture-handler';
import useSocketInput from 'src/hooks/useSocketInput';
import {getPromiseFn} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';

const ChatScreen = () => {
  const {
    chat: {chatSocket},
  } = useSelector((root: RootState) => root, shallowEqual);
  const {currentUser, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const sendSocketMessage = useSocketInput();

  const goToChatRoom = roomId => {
    navigation.navigate(NAV_NAMES.ChatRoom, {currentChatRoomId: roomId});
  };
  const exitChatRoom = roomId => {
    sendSocketMessage(chatSocket, 'exitChatRoom', {
      chatRoomId: roomId,
    });
  };

  const fetchNewRoom = async () => {
    setLoading(true);
    const res = await getPromiseFn({
      url: APIS.chat.chatRoom(currentUser.id).url,
      token,
    });
    if (res?.data) {
      const {chatRooms} = res.data;
      setChatRooms(chatRooms);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNewRoom();
  }, []);

  const RightSwipeActions = () => {
    return (
      <Div flex={1} bg={'red'} justifyCenter itemsEnd>
        <Span color={'#40394a'} px={20} medium>
          톡방 나가기
        </Span>
      </Div>
    );
  };

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
                          strokeWidth={1.5}></MessageCircle>
                        <Div
                          absolute
                          w={'100%'}
                          h={'100%'}
                          itemsCenter
                          justifyCenter>
                          <Span bold>{`${chatRoom.userIds.length}명`}</Span>
                        </Div>
                      </Col>
                      <Col justifyCenter ml10>
                        <Row>
                          <Span fontSize={15} bold>
                            {chatRoom.title}
                          </Span>
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
                              {new Date(
                                chatRoom.lastMessage.createdAt,
                              ).toLocaleDateString('ko-KR')}
                            </Span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Swipeable>
                );
              })}
              {chatRooms.length == 0 && (
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
              )}
            </Div>
          </Div>
        </NativeBaseProvider>
      </ScrollView>
    </Div>
  );
};

export default ChatScreen;
