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
import {
  AlertCircle,
  Bell,
  Grid,
  MessageCircle,
  PlusSquare,
} from 'react-native-feather';
import {Input, NativeBaseProvider} from 'native-base';
import {RootState} from 'src/redux/rootReducer';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {Header} from 'src/components/Header';
import {useNavigation} from '@react-navigation/core';
import {NAV_NAMES} from 'src/modules/navNames';
import {setCurrentChatRoomId} from 'src/redux/chatReducer';
import GestureRecognizer from 'react-native-swipe-gestures';
import {Swipeable} from 'react-native-gesture-handler';
import useSocketInput from 'src/hooks/useSocketInput';

const ChatScreen = () => {
  const {chatRooms, chatSocket} = useSelector(
    (root: RootState) => root.chat,
    shallowEqual,
  );
  const {globalFiter} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );
  const {stations} = useSelector(
    (root: RootState) => root.route.route,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const sendSocketMessage = useSocketInput();

  const [selecting, setSelecting] = useState(Selecting.NONE);
  const selectGetterSetter = {
    [Selecting.GLOBAL_FILTER]: {
      get: globalFiter,
      set: filt => dispatch(setGlobalFilter(filt)),
      options: [MAIN_LINE2, MY_ROUTE, ...stations],
    },
  };
  const goToChatRoom = roomId => {
    dispatch(setCurrentChatRoomId(roomId));
    navigation.navigate(NAV_NAMES.ChatRoom);
  };
  const exitChatRoom = roomId => {
    sendSocketMessage(chatSocket, 'exitChatRoom', {
      chatRoomId: roomId,
    });
  };

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
      <Header
        bg={'rgba(255,255,255,0)'}
        onSelect={() => setSelecting(Selecting.GLOBAL_FILTER)}
      />
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <NativeBaseProvider>
          <Div relative>
            <Div pb10>
              {Object.keys(chatRooms).map(chatRoomId => {
                const chatRoom = chatRooms[chatRoomId];
                const lastMessage =
                  chatRoom.messages[chatRoom.messages.length - 1];
                return (
                  <Swipeable
                    key={chatRoomId}
                    renderRightActions={RightSwipeActions}
                    onSwipeableRightOpen={() => exitChatRoom(chatRoomId)}>
                    <Row
                      px20
                      py10
                      flex
                      onPress={() => goToChatRoom(chatRoomId)}
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
                          <Span bold>{`${chatRoom.usernames.length}명`}</Span>
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
                            <Span fontSize={15}>{lastMessage?.text}</Span>
                          </Col>
                          <Col />
                          <Col auto>
                            <Span fontSize={13} light>
                              {new Date(
                                lastMessage.createdAt,
                              ).toLocaleDateString('ko-KR')}
                            </Span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Swipeable>
                );
              })}
              {Object.keys(chatRooms).length == 0 && (
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
      {selecting && (
        <ScrollSelector
          selectedValue={selectGetterSetter[selecting].get}
          onValueChange={selectGetterSetter[selecting].set}
          options={selectGetterSetter[selecting].options}
          onClose={() => setSelecting(Selecting.NONE)}
        />
      )}
    </Div>
  );
};

export default ChatScreen;
