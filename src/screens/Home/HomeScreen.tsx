import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, FlatList, RefreshControl} from 'react-native';
import {Div} from 'src/components/common/Div';
import APIS from 'src/modules/apis';
import {
  getPromiseFn,
  postPromiseFn,
  useApiPOST,
  useApiSelector,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  Direction,
  LINE2_Linked_List,
  MAIN_LINE2,
  MY_ROUTE,
  PLACE,
  REPORT,
  Selecting,
  SUNGAN,
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
import {useNavigation} from '@react-navigation/core';
import {useScrollToTop} from '@react-navigation/native';
import {Loader} from 'react-native-feather';
import {Row} from 'src/components/common/Row';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'src/modules/viewComponents';
import messaging from '@react-native-firebase/messaging';
import {NAV_NAMES} from 'src/modules/navNames';

const PostsLoading = () => {
  return (
    <>
      <Row px20>
        <SkeletonPlaceholder>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 25,
                height: 25,
                borderRadius: 50,
                marginTop: 10,
              }}
            />
            <View style={{marginLeft: 10}}>
              <View
                style={{
                  width: 80,
                  height: 15,
                  borderRadius: 4,
                  marginTop: 10,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginTop: 10,
            }}>
            <View
              style={{
                width: 350,
                height: 100,
                borderRadius: 5,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 40,
                height: 15,
                borderRadius: 4,
                marginTop: 10,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 200,
                height: 15,
                borderRadius: 4,
                marginTop: 10,
              }}
            />
          </View>
        </SkeletonPlaceholder>
      </Row>
    </>
  );
};

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
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [addPostLoading, setAddPostLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectorLoading, setSelectorLoading] = useState(false);
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const fullStations = useMemo(() => {
    return stationArr([], '시청', '충정로(경기대입구)', Direction.CW);
  }, []);
  const apiGET = useReloadGET();
  const apiPOST = useApiPOST();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const pullToRefresh = useCallback(() => {
    apiPOST(APIS.post.main(), {
      size: 30,
    });
  }, [origin]);
  const addMorePostsOnRefesh = async () => {
    if (!addPostLoading && !noMorePosts) {
      setAddPostLoading(true);
      const res = await postPromiseFn({
        url: APIS.post.main().url,
        body: {
          size: 30,
          lastCreatedAt: posts[posts.length - 1].post.createdAt,
        },
        token,
      });
      if (isOkay(res) && res.data?.data) {
        setPosts([...posts, ...res.data.data]);
        setAddPostLoading(false);
      } else {
        setNoMorePosts(true);
      }
    }
  };

  const exchangeOD = useCallback(() => {
    if (origin && destination) {
      dispatch(exchangeOriginDestination());
    } else {
      Alert.alert('출발지와 도착지를 먼저 설정해주세요.');
    }
  }, [origin, destination]);

  const firebaseMessaging = messaging();

  const handlePress = async notification => {
    const goto = notification.data?.goto;
    const postType = notification.data?.postType;
    const postId = notification.data?.postId;
    const chatRoomId = notification.data?.chatRoomId;
    if (goto == 'Home') {
      navigation.navigate(goto);
      return;
    }
    if (goto == 'Post') {
      let url;
      let type;
      let get;
      if (postType == 'Sungan') {
        url = APIS.post.sungan.id(postId).url;
        type = SUNGAN;
        get = 'sungan';
      } else if (postType == 'Hotplace') {
        url = APIS.post.place.id(postId).url;
        type = PLACE;
        get = 'hotplace';
      } else {
        url = APIS.post.place.id(postId).url;
        type = REPORT;
        get = 'report';
      }
      const res = await getPromiseFn({
        url,
        token,
      });
      if (!isOkay(res)) {
        Alert.alert('해당 게시물은 지워졌습니다.');
      }
      const item = res.data.data;
      const post = item[get];
      const didLike = item.didLike;
      const likeCount = item.likeCnt;
      const stationName = post.station?.name;
      const emoji = post.emoji;
      const userName = post.userInfo.userName;
      const userProfileImgUrl = post.userInfo.userProfileImgUrl;
      const createdAt = post.createdAt;
      const text = post.text;
      const place = post.place;
      const vehicleIdNum = post.vehicleIdNum;
      const currentPost = {
        type,
        didLike,
        stationName,
        emoji,
        userName,
        userProfileImgUrl,
        createdAt,
        likeCount,
        text,
        place,
        vehicleIdNum,
      };
      navigation.navigate(NAV_NAMES.PostDetail, {
        currentPost: {
          setLiked: () => {},
          setLikeCount: () => {},
          ...currentPost,
        },
      });
    }
    if (goto == 'Chat') {
      navigation.navigate(NAV_NAMES.ChatRoom, {currentChatRoomId: chatRoomId});
    }
  };
  const createNotificationListeners = async () => {
    //앱이 foreground, background에서 실행 중일때, push 알림을 클릭하여 열 때,
    firebaseMessaging.onNotificationOpenedApp(remoteMessage => {
      handlePress(remoteMessage);
    });

    //앱이 종료된 상황에서 push 알림을 클릭하여 열 때
    const notificationOpen = await firebaseMessaging.getInitialNotification();
    if (notificationOpen) {
      // receiveNotification(notificationOpen.notification.data);
      console.log(notificationOpen.notification);
      handlePress(notificationOpen.notification);
    }
  };

  useEffect(() => {
    createNotificationListeners();
    if (!origin || !destination) {
      apiGET(APIS.route.starred());
    }
    if (posts.length == 0) {
      apiPOST(APIS.post.main(), {
        size: 20,
      });
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
  useScrollToTop(scrollRef);
  const setStationNotification = useCallback(() => {
    if (receiveStationPush && selectedTrain) {
      postPromiseFn({
        url: APIS.route.notification().url,
        body: {
          trainNo: selectedTrain?.trainNo,
          stations: [
            LINE2_Linked_List.get(destination)[
              direction == Direction.INNER ? 'next' : 'prev'
            ].split('(')[0],
          ],
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
      <Div flex relative>
        <Header
          bg={'rgba(255,255,255,.9)'}
          onSelect={handleSelectGlobalFilter}
        />
        <FlatList
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          onEndReached={addMorePostsOnRefesh}
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
          ListFooterComponent={
            addPostLoading && !noMorePosts ? <PostsLoading /> : <FeedChecked />
          }
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
