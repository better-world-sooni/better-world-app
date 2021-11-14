import {
useNavigation
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import {IMAGES} from 'src/modules/images';
import {NAV_NAMES} from 'src/modules/navNames';
import {ScrollView} from 'src/modules/viewComponents';
import {
  deletePromiseFn,
  postPromiseFn,
  useApiSelector,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {ChevronDown, LogOut, PlusSquare} from 'react-native-feather';
import {
  chevronDownSettings,
  GRAY_COLOR,
  HAS_NOTCH,
  iconSettings,
  MAIN_LINE2,
  MY_ROUTE,
  REPORT,
  Selecting,
  shortenStations,
  SUNGAN,
} from 'src/modules/constants';
import {appActions, useLogout} from 'src/redux/appReducer';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {RootState} from 'src/redux/rootReducer';
import {toggleReceiveStationPush} from 'src/redux/routeReducer';
import {Alert, RefreshControl, Switch} from 'react-native';
import {Sungan} from 'src/components/Sungan';
import {Report} from 'src/components/Report';
import {Place} from 'src/components/Place';
import AvatarSelect from 'src/components/AvatarSelect';
import {isOkay, stationArr} from 'src/modules/utils';

const ProfileScreen = props => {
  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const logout = useLogout(() => navigation.navigate(NAV_NAMES.SignIn));
  const {data: mySunganResponse, isLoading: mySunganLoading} = useApiSelector(
    APIS.post.sungan.my,
  );
  const mySungans = mySunganResponse?.data;
  const {
    route: {
      receiveStationPush,
      route: {stations, direction},
      selectedTrain,
    },
    feed: {globalFiter},
  } = useSelector((root: RootState) => root, shallowEqual);
  const {currentUser, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const [character, setCharacter] = useState(null);
  const dispatch = useDispatch();
  const [selectingAvatar, setSelectingAvatar] = useState(false);
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
        Alert.alert('Success', '역알림이 취소 되었습니다.');
      } else {
        Alert.alert('Error', '역알림이 취소중 문제가 발생하였습니다.');
      }
    } else {
      dispatch(toggleReceiveStationPush());
      if (selectedTrain) {
        const res = await postPromiseFn({
          url: APIS.route.notification().url,
          body: {
            trainNo: selectedTrain?.trainNo,
            stations: shortenStations(
              stationArr(
                [],
                selectedTrain.statnNm,
                stations[stations.length - 1],
                direction,
              ),
            ),
          },
          token: token,
        });
        if (isOkay(res)) {
          Alert.alert('Success', '역알림이 설정 되었습니다.');
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
  const pullToRefresh = useCallback(() => {
    apiGET(APIS.post.sungan.my());
  }, [apiGET]);
  const filterPostsByStation = useCallback(
    post => {
      if (post.type === REPORT) {
        return true;
      } else if (!post.station?.name) {
        return true;
      } else if (
        globalFiter === MY_ROUTE &&
        !MY_ROUTE.includes(post.station.name)
      ) {
        return false;
      } else if (
        globalFiter !== MAIN_LINE2 &&
        globalFiter !== post.station.name
      ) {
        return false;
      } else {
        return true;
      }
    },
    [globalFiter],
  );
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
  const MySunganMap = useCallback(
    (post, index) => {
      if (post.type == SUNGAN) {
        return (
          <Sungan
            post={post}
            dispatch={dispatch}
            navigation={navigation}
            token={token}
            key={index}
            mine
          />
        );
      } else if (post.type == REPORT) {
        return (
          <Report
            post={post}
            dispatch={dispatch}
            navigation={navigation}
            token={token}
            key={index}
            mine
          />
        );
      } else {
        return (
          <Place
            post={post}
            dispatch={dispatch}
            navigation={navigation}
            token={token}
            key={index}
            mine
          />
        );
      }
    },
    [navigation, token],
  );
  const handleSelectGlobalFilter = useCallback(
    () => setSelecting(Selecting.GLOBAL_FILTER),
    [],
  );
  const handleSelectDone = useCallback(() => setSelecting(Selecting.NONE), []);
  const handleSelectAvatar = useCallback(() => setSelectingAvatar(true), []);
  const handleGotoPost = useCallback(
    () => navigation.navigate(NAV_NAMES.Post),
    [],
  );

  useEffect(() => {
    pullToRefresh();
  }, []);

  return (
    <Div flex backgroundColor={'white'}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Row itemsCenter py10 px20 bg={'rgba(255,255,255,0)'}>
        <Col justifyCenter>
          <Row>
            <Col auto justifyCenter>
              <Span>{receiveStationPush ? '역알림 킴' : '역알림 끔'}</Span>
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
        </Col>
        <Col itemsCenter justifyCenter onPress={handleSelectGlobalFilter}>
          <Row itemsCenter>
            <Col auto>
              <Span
                bold
                textCenter
                color={'black'}
                fontSize={15}
                numberOfLines={1}
                ellipsizeMode="head">
                {globalFiter}
              </Span>
            </Col>
            <Col auto justifyCenter>
              <ChevronDown {...chevronDownSettings}></ChevronDown>
            </Col>
          </Row>
        </Col>
        <Col itemsEnd>
          <Row itemsEnd>
            <Col itemsEnd onPress={logout}>
              <LogOut {...iconSettings} color={'black'}></LogOut>
            </Col>
          </Row>
        </Col>
      </Row>
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={mySunganLoading}
            onRefresh={pullToRefresh}
          />
        }>
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
              my10
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
        </Div>
        <Div mt10>
          {mySungans && mySungans.filter(filterPostsByStation).map(MySunganMap)}
        </Div>
        {(!mySungans || mySungans.length == 0) && (
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
        )}
      </ScrollView>
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
    </Div>
  );
};

export default ProfileScreen;
  