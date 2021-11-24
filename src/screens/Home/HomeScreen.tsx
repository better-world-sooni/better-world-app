import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, RefreshControl} from 'react-native';
import {Div} from 'src/components/common/Div';
import APIS from 'src/modules/apis';
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import {
  getPromiseFn,
  postPromiseFn,
  useApiSelector,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  Direction,
  HAS_NOTCH,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
  shortenStations,
} from 'src/modules/constants';
import {
  setRoute,
  setDestination,
  setOrigin,
  setDirection,
  exchangeOriginDestination,
} from 'src/redux/routeReducer';
import {isOkay, stationArr} from 'src/modules/utils';
import {RootState} from 'src/redux/rootReducer';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {Header} from 'src/components/Header';
import {ScrollSelector} from 'src/components/ScrollSelector';
import TrainStatusBox from 'src/components/TrainStatusBox';
import OD from 'src/components/OD';
import FeedChecked from 'src/components/FeedChecked';
import Post from 'src/components/Post';

const HomeScreen = props => {
  const {data: mainResponse, isLoading: mainLoading} = useApiSelector(
    APIS.post.main,
  );
  const mainFeed = mainResponse?.data;
  const {data: starredResponse, isLoading: starredLoading} = useApiSelector(
    APIS.route.starred,
  );
  const defaultRoute = starredResponse?.data?.[0];
  const {
    route: {origin, destination, direction, stations},
    selectedTrain,
    receiveStationPush,
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {globalFiter} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );
  const [posts, setPosts] = useState([]);
  const [selectorLoading, setSelectorLoading] = useState(false);
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const fullStations = useMemo(() => {
    return stationArr([], '시청', '충정로(경기대입구)', Direction.CW);
  }, []);
  const apiGET = useReloadGET();
  const dispatch = useDispatch();
  const pullToRefresh = useCallback(() => {
    apiGET(APIS.post.main());
  }, [origin]);

  const exchangeOD = useCallback(() => {
    if (origin && destination) {
      dispatch(exchangeOriginDestination());
    } else {
      Alert.alert('출발지와 도착지를 먼저 설정해주세요.');
    }
  }, [origin, destination]);

  useEffect(() => {
    if (!origin || !destination) {
      apiGET(APIS.route.starred());
    }
    if (posts.length == 0) {
      apiGET(APIS.post.main());
    }
  }, []);
  useEffect(() => {
    if (defaultRoute && !starredLoading && (!origin || !destination)) {
      dispatch(setRoute(defaultRoute.route));
    }
  }, [starredLoading]);
  useEffect(() => {
    if (!mainLoading && mainFeed) {
      setPosts(mainFeed);
    }
  }, [mainLoading]);
  const setStationNotification = useCallback(() => {
    if (receiveStationPush && selectedTrain) {
      postPromiseFn({
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
      Alert.alert('역알림이 설정 되었습니다.');
    }
  }, [receiveStationPush, selectedTrain?.trainNo, stations, direction]);
  const handleSetOrigin = ori => {
    dispatch(setOrigin(ori));
    setStationNotification();
  };
  const handleSetDestination = dest => {
    dispatch(setDestination(dest));
    setStationNotification();
  };
  const handleSetDirection = dir => {
    dispatch(setDirection(dir));
    setStationNotification();
  };
  const selectGetterSetter = {
    [Selecting.ORIGIN]: {
      get: origin,
      set: handleSetOrigin,
      options: fullStations,
    },
    [Selecting.DESTINATION]: {
      get: destination,
      set: handleSetDestination,
      options: fullStations,
    },
    [Selecting.DIRECTION]: {
      get: direction,
      set: handleSetDirection,
      options: [Direction.INNER, Direction.OUTER],
    },
    [Selecting.GLOBAL_FILTER]: {
      get: globalFiter,
      set: filt => dispatch(setGlobalFilter(filt)),
      options: [MAIN_LINE2, MY_ROUTE, ...stations],
    },
  };

  const handleSelectGlobalFilter = useCallback(
    () => setSelecting(Selecting.GLOBAL_FILTER),
    [],
  );
  const handleSelectOrigin = useCallback(
    () => setSelecting(Selecting.ORIGIN),
    [],
  );
  const handleSelectDestination = useCallback(
    () => setSelecting(Selecting.DESTINATION),
    [],
  );
  const handleSelectDirection = useCallback(
    () => setSelecting(Selecting.DIRECTION),
    [],
  );
  const handleSelectDone = useCallback(() => setSelecting(Selecting.NONE), []);
  const handlePressCenter = async () => {
    setSelectorLoading(true);
    const res = await getPromiseFn({url: APIS.route.starred().url, token});
    if (isOkay(res)) {
      dispatch(setRoute(res?.data?.data?.[0].route));
    }
    setSelectorLoading(false);
    setSelecting(Selecting.NONE);
  };

  return (
    <Div flex bgWhite>
      <Div h={HAS_NOTCH ? 44 : 20} bg={'rgba(255,255,255,.9)'} />
      <Div flex relative>
        <Header
          bg={'rgba(255,255,255,.9)'}
          onSelect={handleSelectGlobalFilter}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Div bg={'rgba(255,255,255,.9)'}>
                <OD
                  origin={origin}
                  destination={destination}
                  handleSelectDestination={handleSelectDestination}
                  handleSelectOrigin={handleSelectOrigin}
                  exchangeOD={exchangeOD}
                />
              </Div>
              <TrainStatusBox handleSelectDirection={handleSelectDirection} />
            </>
          }
          ListFooterComponent={<FeedChecked />}
          data={posts}
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
                userNameBC={userNameBC}
                userProfileImgUrlBC={userProfileImgUrlBC}
                contentBC={contentBC}
                key={index}
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={mainLoading}
              onRefresh={pullToRefresh}
            />
          }></FlatList>
      </Div>
      {selecting && (
        <ScrollSelector
          loading={selectorLoading}
          selectedValue={selectGetterSetter[selecting].get}
          onValueChange={selectGetterSetter[selecting].set}
          options={selectGetterSetter[selecting].options}
          onClose={handleSelectDone}
          onPressCenter={
            selecting == Selecting.DESTINATION || selecting == Selecting.ORIGIN
              ? handlePressCenter
              : null
          }
        />
      )}
    </Div>
  );
};

export default HomeScreen;
