import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {RefreshControl, StyleSheet} from 'react-native';
import firebase from '@react-native-firebase/app';
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
import {FlatList, ScrollView, View} from 'src/modules/viewComponents';
import {useApiPOST, useApiSelector, useReloadGET} from 'src/redux/asyncReducer';
import {useDispatch} from 'react-redux';
import {confirmCurrentRoute} from 'src/redux/routeReducer';
import {
  Map,
  Bell,
  Info,
  Lock,
  Send,
  Folder,
  Edit,
  Rss,
  LogOut,
} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import {useLogout} from 'src/redux/appReducer';

const ProfileScreen = props => {
  const {data: starredResponse, isLoading} = useApiSelector(APIS.route.starred);
  const defaultRoute = starredResponse?.[0];
  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const apiPOST = useApiPOST();
  const dispatch = useDispatch();
  const logout = useLogout(() => navigation.navigate(NAV_NAMES.SignIn));

  const pullToRefresh = () => {
    apiGET(APIS.route.starred());
  };

  const [Route, setRoute] = useState(null);

  useEffect(() => {
    pullToRefresh();
  }, []);
  useEffect(() => {
    if (defaultRoute) {
      setRoute(defaultRoute.route);
    }
  }, [isLoading]);

  const onPressPNList = () => {
    // initBadgeNum();
    navigation.navigate(NAV_NAMES.Home);
  };

  return (
    <Div flex backgroundColor={'white'}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={pullToRefresh} />
        }>
        <Div relative px20>
          <Row h40 itemsCenter>
            <Col></Col>
            <Col auto ml5>
              <Div relative onPress={onPressPNList}>
                {true && (
                  <Div
                    absolute
                    bgDanger
                    w10
                    h10
                    rounded16
                    zIndex5
                    top={-3}
                    right
                  />
                )}
                <Bell stroke="#2e2e2e" fill="#fff" strokeWidth={1.5}></Bell>
              </Div>
            </Col>
          </Row>
          <Row itemsCenter mt10>
            <Col></Col>
            <Col auto>
              <Row rounded100 overflowHidden>
                <Img source={IMAGES.example2} h200 w200></Img>
              </Row>
              <Row py20>
                <Col></Col>
                <Col auto>
                  <Span bold fontSize={20}>
                    irlyglo
                  </Span>
                </Col>
                <Col></Col>
              </Row>
            </Col>
            <Col></Col>
          </Row>
          <Row
            itemsCenter
            rounded20
            backgroundColor={'rgb(242, 242, 247)'}
            px20
            my10
            py10>
            <Col>
              <Row py10>
                <Col auto mr5>
                  <Info color={'black'} strokeWidth={1.5}></Info>
                </Col>
                <Col auto>
                  <Span fontSize={15}>개인정보</Span>
                </Col>
                <Col></Col>
              </Row>
              <Row py10>
                <Col auto mr5>
                  <Lock color={'black'} strokeWidth={1.5}></Lock>
                </Col>
                <Col auto>
                  <Span fontSize={15}>보안</Span>
                </Col>
                <Col></Col>
              </Row>
              <Row py10 onPress={logout}>
                <Col auto mr5>
                  <LogOut color={'black'} strokeWidth={1.5}></LogOut>
                </Col>
                <Col auto>
                  <Span fontSize={15}>로그아웃</Span>
                </Col>
                <Col></Col>
              </Row>
            </Col>
          </Row>
          <Row
            itemsCenter
            rounded20
            backgroundColor={'rgb(242, 242, 247)'}
            px20
            my10
            py10>
            <Col>
              <Row py10>
                <Col auto mr5>
                  <Map color={'black'} strokeWidth={1.5}></Map>
                </Col>
                <Col auto>
                  <Span fontSize={15}>자주가는 길</Span>
                </Col>
                <Col></Col>
              </Row>
            </Col>
          </Row>
          <Row
            itemsCenter
            rounded20
            backgroundColor={'rgb(242, 242, 247)'}
            px20
            my10
            py10>
            <Col>
              <Row py10>
                <Col auto mr5>
                  <Edit color={'black'} strokeWidth={1.5}></Edit>
                </Col>
                <Col auto>
                  <Span fontSize={15}>글</Span>
                </Col>
                <Col></Col>
              </Row>
              <Row py10>
                <Col auto mr5>
                  <Rss color={'black'} strokeWidth={1.5}></Rss>
                </Col>
                <Col auto>
                  <Span fontSize={15}>순간 드랍</Span>
                </Col>
                <Col></Col>
              </Row>
            </Col>
          </Row>
        </Div>
      </ScrollView>
    </Div>
  );
};

export default ProfileScreen;
