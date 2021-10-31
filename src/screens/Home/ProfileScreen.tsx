import {
useNavigation
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import '@react-native-firebase/messaging';
import '@react-native-firebase/auth';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import {IMAGES} from 'src/modules/images';
import {NAV_NAMES} from 'src/modules/navNames';
import {ScrollView} from 'src/modules/viewComponents';
import {useApiSelector, useReloadGET} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {ChevronDown, LogOut} from 'react-native-feather';
import {
  chevronDownSettings,
  GRAY_COLOR,
  HAS_NOTCH,
  iconSettings,
  MAIN_LINE2,
  MY_ROUTE,
  REPORT,
  Selecting,
  SUNGAN,
} from 'src/modules/constants';
import {useLogout} from 'src/redux/appReducer';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {RootState} from 'src/redux/rootReducer';
import {toggleReceiveStationPush} from 'src/redux/routeReducer';
import {RefreshControl, Switch} from 'react-native';
import {Sungan} from 'src/components/Sungan';
import {Report} from 'src/components/Report';
import {Place} from 'src/components/Place';

const ProfileScreen = props => {
  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const logout = useLogout(() => navigation.navigate(NAV_NAMES.SignIn));
  const {data: mySunganResponse, isLoading: mySunganLoading} = useApiSelector(
    APIS.post.sungan.my,
  );
  const mySungans = mySunganResponse?.data;
  console.log('mySungans', mySungans);

  const {stations} = useSelector(
    (root: RootState) => root.route.route,
    shallowEqual,
  );
  const {
    route: {receiveStationPush},
    feed: {globalFiter},
  } = useSelector((root: RootState) => root, shallowEqual);
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const dispatch = useDispatch();

  const selectGetterSetter = {
    [Selecting.GLOBAL_FILTER]: {
      get: globalFiter,
      set: filt => dispatch(setGlobalFilter(filt)),
      options: [MAIN_LINE2, MY_ROUTE, ...stations],
    },
  };

  const goToPost = () => navigation.navigate(NAV_NAMES.Post);

  const toggleStationPush = () => {
    dispatch(toggleReceiveStationPush());
  };
  const pullToRefresh = () => {
    apiGET(APIS.route.starred());
    apiGET(APIS.post.sungan.my());
  };

  const filterPostsByStation = post => {
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
  };

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
        <Col
          itemsCenter
          justifyCenter
          onPress={() => setSelecting(Selecting.GLOBAL_FILTER)}>
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
              <Img source={IMAGES.example2} h100 w100></Img>
            </Col>
            <Col px20 flex>
              <Row itemsCenter flex={1}>
                <Col auto>
                  <Span bold fontSize={20}>
                    irlyglo
                  </Span>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Row
            itemsCenter
            my10
            py10
            rounded5
            borderWidth={0.5}
            borderColor={GRAY_COLOR}>
            <Col></Col>
            <Col auto>
              <Span>프로필 편집</Span>
            </Col>
            <Col></Col>
          </Row> */}
        </Div>
        <Div mt10>
          {mySungans &&
            mySungans
              .filter(post => {
                return filterPostsByStation(post);
              })
              .map((post, index) => {
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
              })}
        </Div>
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

export default ProfileScreen;
  