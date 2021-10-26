import {
useNavigation
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import '@react-native-firebase/auth';
import { Col } from 'src/components/common/Col';
import { Div } from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import { IMAGES } from 'src/modules/images';
import { NAV_NAMES } from 'src/modules/navNames';
import {ScrollView} from 'src/modules/viewComponents';
import {useReloadGET} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {ChevronDown, Edit2, Info, Lock, LogOut} from 'react-native-feather';
import {
  chevronDownSettings,
  GO_COLOR,
  HAS_NOTCH,
  iconSettings,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
} from 'src/modules/constants';
import {useLogout} from 'src/redux/appReducer';
import {Header} from 'src/components/Header';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {RootState} from 'src/redux/rootReducer';

const ProfileScreen = props => {
  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const logout = useLogout(() => navigation.navigate(NAV_NAMES.SignIn));
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const {stations} = useSelector(
    (root: RootState) => root.route.route,
    shallowEqual,
  );
  const {
    route: {selectedTrain},
    feed: {globalFiter},
  } = useSelector((root: RootState) => root, shallowEqual);
  const dispatch = useDispatch();

  const selectGetterSetter = {
    [Selecting.GLOBAL_FILTER]: {
      get: globalFiter,
      set: filt => dispatch(setGlobalFilter(filt)),
      options: [MAIN_LINE2, MY_ROUTE, ...stations],
    },
  };

  const goToPost = () => navigation.navigate(NAV_NAMES.Post);
  const goToReport = () => navigation.navigate(NAV_NAMES.Report);

  const pullToRefresh = () => {
    apiGET(APIS.route.starred());
  };

  useEffect(() => {
    pullToRefresh();
  }, []);

  return (
    <Div flex backgroundColor={'white'}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Row itemsCenter py10 px20 bg={'rgba(255,255,255,0)'}>
        <Col w80 auto>
          <Row justifyCenter>
            <Col justifyCenter>
              <Span>
                {selectedTrain ? selectedTrain.currentStation : '탑승전'}
              </Span>
            </Col>
          </Row>
        </Col>
        <Col
          rounded5
          itemsCenter
          justifyCenter
          onPress={() => setSelecting(Selecting.GLOBAL_FILTER)}>
          <Row>
            <Col itemsCenter auto>
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
        <Col w80 itemsEnd auto>
          <Row itemsEnd>
            <Col onPress={goToPost} itemsEnd>
              <LogOut {...iconSettings} color={'black'}></LogOut>
            </Col>
          </Row>
        </Col>
      </Row>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
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
          <Row
            itemsCenter
            my10
            py10
            rounded5
            borderWidth={0.5}
            borderColor={'rgb(199,199,204)'}>
            <Col></Col>
            <Col auto>
              <Span>프로필 편집</Span>
            </Col>
            <Col></Col>
          </Row>
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
  