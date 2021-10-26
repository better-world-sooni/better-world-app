import React, {useEffect, useState} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {ScrollView} from 'src/modules/viewComponents';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  HAS_NOTCH,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
} from 'src/modules/constants';
import {
  AlertCircle,
  Bell,
  MessageCircle,
  PlusSquare,
} from 'react-native-feather';
import {Input, NativeBaseProvider} from 'native-base';
import {RootState} from 'src/redux/rootReducer';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {Header} from 'src/components/Header';

const ChatScreen = props => {
  const {chatRooms} = useSelector((root: RootState) => root.chat, shallowEqual);
  const {globalFiter} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );
  const {stations} = useSelector(
    (root: RootState) => root.route.route,
    shallowEqual,
  );
  const dispatch = useDispatch();

  const iconSettings = {
    strokeWidth: 1.3,
    color: 'black',
    height: 25,
  };

  const [selecting, setSelecting] = useState(Selecting.NONE);
  const selectGetterSetter = {
    [Selecting.GLOBAL_FILTER]: {
      get: globalFiter,
      set: filt => dispatch(setGlobalFilter(filt)),
      options: [MAIN_LINE2, MY_ROUTE, ...stations],
    },
  };

  return (
    <Div flex backgroundColor={'white'}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Header
        bg={'rgba(255,255,255,0)'}
        onSelect={() => setSelecting(Selecting.GLOBAL_FILTER)}
      />
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <NativeBaseProvider>
          <Div relative>
            <Div px20 pb10>
              {Object.keys(chatRooms).map(chatRoomId => {
                const chatRoom = chatRooms[chatRoomId];
                const lastMessage =
                  chatRoom.messages[chatRoom.messages.length - 1];
                return (
                  <Row py10 flex key={chatRoomId}>
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
                            {new Date(lastMessage.createdAt).toLocaleDateString(
                              'ko-KR',
                            )}
                          </Span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                );
              })}
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
