import {
useNavigation
} from '@react-navigation/native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import {IMAGES} from 'src/modules/images';
import {NAV_NAMES} from 'src/modules/navNames';
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import {
  deletePromiseFn,
  getPromiseFn,
  postPromiseFn,
  useApiSelector,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {LogOut, PlusSquare} from 'react-native-feather';
import {
  Direction,
  GRAY_COLOR,
  HAS_NOTCH,
  iconSettings,
  LINE2_Linked_List,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
  shortenStations,
} from 'src/modules/constants';
import {appActions, useLogout} from 'src/redux/appReducer';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {RootState} from 'src/redux/rootReducer';
import {toggleReceiveStationPush} from 'src/redux/routeReducer';
import {Alert, RefreshControl, Switch} from 'react-native';
import AvatarSelect from 'src/components/AvatarSelect';
import {isOkay, stationArr} from 'src/modules/utils';
import ODSelect from 'src/components/ODSelect';
import Post from 'src/components/Post';

const ProfileScreen = props => {
  const navigation = useNavigation();
  const logout = useLogout(() => navigation.navigate(NAV_NAMES.SignIn));
  const {
    route: {
      receiveStationPush,
      route: {stations, direction, destination},
      selectedTrain,
    },
    feed: {globalFiter},
  } = useSelector((root: RootState) => root, shallowEqual);
  const {currentUser, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const [character, setCharacter] = useState(null);
  const dispatch = useDispatch();
  const [selectingAvatar, setSelectingAvatar] = useState(false);
  const [selectingOD, setSelectingOD] = useState(false);
  const selectGetterSetter = {
    [Selecting.GLOBAL_FILTER]: {
      get: globalFiter,
      set: filt => dispatch(setGlobalFilter(filt)),
      options: [MAIN_LINE2, MY_ROUTE, ...stations],
    },
  };
  const toggleStationPush = useCallback(async () => {
    if (receiveStationPush) {
      dispatch(toggleReceiveStationPush());
      const res = await deletePromiseFn({
        url: APIS.route.notification().url,
        body: {},
        token: token,
      });
      if (isOkay(res)) {
        Alert.alert('역알림이 취소 되었습니다.');
      } else {
        Alert.alert('Error', '역알림이 취소중 문제가 발생하였습니다.');
      }
    } else {
      dispatch(toggleReceiveStationPush());
      if (selectedTrain && destination) {
        const res = await postPromiseFn({
          url: APIS.route.notification().url,
          body: {
            trainNo: selectedTrain?.trainNo,
            stations: [
              LINE2_Linked_List.get(destination)[
                direction == Direction.INNER ? 'prev' : 'next'
              ].split('(')[0],
            ],
          },
          token: token,
        });
        if (isOkay(res)) {
          Alert.alert('역알림이 설정 되었습니다.');
        } else {
          Alert.alert('Error', '역알림이 설정중 문제가 발생하였습니다.');
        }
      }
    }
  }, [
    receiveStationPush,
    toggleReceiveStationPush,
    selectedTrain,
    stations,
    direction,
  ]);
  const pullToRefresh = useCallback(async () => {
    setLoading(true);
    const res = await getPromiseFn({
      url: APIS.post.sungan.my().url,
      token,
    });
    if (isOkay(res) && res.data.data) {
      setMyPosts(res.data.data);
    }
    setLoading(false);
  }, [token]);
  const handleReturnSelectAvatar = useCallback(async () => {
    setSelectingAvatar(false);
    if (character) {
      const res = await postPromiseFn({
        url: APIS.auth.avatar().url,
        body: {
          jwtToken: token,
          avatar: character,
        },
        token: '',
      });
      if (res.status == 200) {
        const {avatar} = res.data;
        dispatch(appActions.updateUserAvatar(avatar));
        Alert.alert('아바타를 성공적으로 바꾸었습니다.');
      } else {
        Alert.alert('아바타를 바꾸는 도중 문제가 생겼습니다.');
      }
    }
  }, [character, token, appActions]);
  const handleReturnSelectOD = () => {
    setSelectingOD(false);
  };
  const handleSelectDone = useCallback(() => setSelecting(Selecting.NONE), []);
  const handleSelectAvatar = useCallback(() => setSelectingAvatar(true), []);
  const handleSelectOD = useCallback(() => setSelectingOD(true), []);
  const handleGotoPost = useCallback(
    () => navigation.navigate(NAV_NAMES.Post),
    [],
  );
  useEffect(() => {
    if (myPosts.length == 0) {
      pullToRefresh();
    }
  }, []);

  return (
    <Div flex backgroundColor={'white'}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Row itemsCenter py10 px20 bg={'white'}>
        <Col justifyCenter>
          <Row itemsCenter>
            <Col itemsCenter auto pr5>
              <Span
                bold
                textCenter
                color={'black'}
                fontSize={20}
                numberOfLines={1}
                ellipsizeMode="head">
                프로필
              </Span>
            </Col>
          </Row>
        </Col>
        <Col pl15 auto onPress={logout}>
          <LogOut {...iconSettings} color={'black'}></LogOut>
        </Col>
      </Row>
      <FlatList
        flex={1}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Div relative px20>
            <Row itemsCenter mt10>
              <Col auto rounded100 overflowHidden>
                <Img
                  source={IMAGES.characters[currentUser.avatar]}
                  h100
                  w100></Img>
              </Col>
              <Col px20 flex>
                <Row itemsCenter flex={1}>
                  <Col auto>
                    <Span bold fontSize={20}>
                      {currentUser.username}
                    </Span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Div onPress={handleSelectAvatar}>
              <Row
                itemsCenter
                mt10
                mb5
                py10
                rounded5
                borderWidth={0.5}
                borderColor={GRAY_COLOR}>
                <Col></Col>
                <Col auto>
                  <Span>아바타 바꾸기</Span>
                </Col>
                <Col></Col>
              </Row>
            </Div>
            <Div onPress={handleSelectOD}>
              <Row
                itemsCenter
                mt5
                mb10
                py10
                rounded5
                borderWidth={0.5}
                borderColor={GRAY_COLOR}>
                <Col></Col>
                <Col auto>
                  <Span>자주가는 길 설정</Span>
                </Col>
                <Col></Col>
              </Row>
            </Div>
            <Div>
              <Row
                mt5
                mb10
                py5
                rounded5
                borderWidth={0.5}
                borderColor={GRAY_COLOR}>
                <Col />
                <Col auto justifyCenter>
                  <Span>
                    {receiveStationPush
                      ? '도착지 전역 알림 킴'
                      : '도착지 전역 알림 끔'}
                  </Span>
                </Col>
                <Col auto justifyCenter>
                  <Switch
                    style={{
                      transform: [{scaleX: 0.5}, {scaleY: 0.5}],
                    }}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleStationPush}
                    value={receiveStationPush}
                  />
                </Col>
                <Col />
              </Row>
            </Div>
          </Div>
        }
        data={myPosts}
        renderItem={({item, index}) => {
          const type = item.type;
          const didLike = item.didLike;
          const postId = item.post.id;
          const stationName = item.post.station?.name;
          const emoji = item.post.emoji;
          const userName = item.post.userInfo.userName;
          const userProfileImgUrl = item.post.userInfo.userProfileImgUrl;
          const createdAt = item.post.createdAt;
          const likeCnt = item.post.likeCnt;
          const text = item.post.text;
          const place = item.post.place;
          const vehicleIdNum = item.post.vehicleIdNum;
          const userNameBC = item.bestComment?.userInfo.userName;
          const userProfileImgUrlBC =
            item.bestComment?.userInfo.userProfileImgUrl;
          const contentBC = item.bestComment?.content;
          return (
            <Post
              type={type}
              vehicleIdNum={vehicleIdNum}
              didLike={didLike}
              postId={postId}
              stationName={stationName}
              emoji={emoji}
              userName={userName}
              userProfileImgUrl={userProfileImgUrl}
              createdAt={createdAt}
              likeCnt={likeCnt}
              text={text}
              place={place}
              mine={true}
              userNameBC={userNameBC}
              userProfileImgUrlBC={userProfileImgUrlBC}
              contentBC={contentBC}
              key={index}
            />
          );
        }}
        ListEmptyComponent={
          <>
            <Row itemsCenter justifyCenter pt20 pb10 onPress={handleGotoPost}>
              <Col h2 />
              <Col auto>
                <PlusSquare
                  height={50}
                  width={50}
                  strokeWidth={0.7}
                  color={GRAY_COLOR}></PlusSquare>
              </Col>
              <Col h2></Col>
            </Row>
            <Row pb20>
              <Col></Col>
              <Col auto>
                <Span color={GRAY_COLOR}>게시물을 올려보세요!</Span>
              </Col>
              <Col></Col>
            </Row>
          </>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={pullToRefresh} />
        }></FlatList>
      {selecting && (
        <ScrollSelector
          selectedValue={selectGetterSetter[selecting].get}
          onValueChange={selectGetterSetter[selecting].set}
          options={selectGetterSetter[selecting].options}
          onClose={handleSelectDone}
        />
      )}
      <AvatarSelect
        visible={selectingAvatar}
        onPressReturn={handleReturnSelectAvatar}
        character={character}
        setCharacter={setCharacter}
      />
      <ODSelect visible={selectingOD} onPressReturn={handleReturnSelectOD} />
    </Div>
  );
};

export default ProfileScreen;
  