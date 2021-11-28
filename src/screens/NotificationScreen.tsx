import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {Bell} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {Header} from 'src/components/Header';
import NotificationItem from 'src/components/NotificationItem';
import APIS from 'src/modules/apis';
import {GRAY_COLOR} from 'src/modules/constants';
import {FlatList} from 'src/modules/viewComponents';
import {getPromiseFn, patchPromiseFn} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';

const NoNotifications = () => {
  return (
    <>
      <Row itemsCenter justifyCenter pt20 pb10>
        <Col h2 />
        <Col auto>
          <Bell
            height={50}
            width={50}
            strokeWidth={0.7}
            color={GRAY_COLOR}></Bell>
        </Col>
        <Col h2></Col>
      </Row>
      <Row pb20>
        <Col></Col>
        <Col auto>
          <Span color={GRAY_COLOR}>확인할 알림이 없습니다.</Span>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
};

const NotificationScreen = () => {
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [notifications, setNotifications] = useState([]);
  const fetchNewRoom = async () => {
    const res = await getPromiseFn({
      url: APIS.push.notification.user().url,
      token,
    });
    if (res.data) {
      setNotifications(res.data);
    }
  };
  const readAll = async () => {
    const res = await patchPromiseFn({
      url: APIS.push.notification.user().url,
      token,
    });
  };

  useFocusEffect(() => {
    fetchNewRoom();
    readAll();
  });

  return (
    <Div flex bg={'white'}>
      <Header bg={'white'} headerTitle={'알림'} noButtons hasGoBack />
      <FlatList
        flex={1}
        showsVerticalScrollIndicator={false}
        data={notifications}
        ListEmptyComponent={<NoNotifications />}
        renderItem={({item}) => {
          const title = item.title;
          const body = item.body;
          const createdAt = item.createdAt;
          const goto = item.data?.goto;
          const notiType = item.data?.notiType;
          const postId = item.data?.postId;
          const postType = item.data?.postType;
          const chatRoomId = item.data?.chatRoomId;
          // console.log(item);
          return (
            <NotificationItem
              title={title}
              body={body}
              createdAt={createdAt}
              goto={goto}
              notiType={notiType}
              postId={postId}
              postType={postType}
              chatRoomId={chatRoomId}
            />
          );
        }}
      />
    </Div>
  );
};

export default NotificationScreen;
