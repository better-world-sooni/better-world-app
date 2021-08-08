import {
  useNavigation
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import '@react-native-firebase/auth';
import { Col } from 'src/components/common/Col';
import { Div } from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import { useLocale } from 'src/i18n/useLocale';
import APIS from 'src/modules/apis';
import { IMAGES } from 'src/modules/images';
import { NAV_NAMES } from 'src/modules/navNames';
import { ScrollView } from 'src/modules/viewComponents';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import CreditPackages from 'src/components/CreditPackages';
import { useDispatch } from 'react-redux';
import SunganCollection from 'src/components/SunganCollection';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'src/components/MapViewDirections';
import { Dimensions } from 'react-native';
import { ICONS } from 'src/modules/icons';
import { confirmCurrentRoute } from 'src/redux/pathReducer';
import { Search } from 'react-native-feather';



const HomeScreen = (props) => {
  const {data: defaultTo, isLoading} = useApiSelector(APIS.paths.defaultTo);
  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const apiPOST = useApiPOST();
  const {t, locale} = useLocale();
  const dispatch = useDispatch()

  const pullToRefresh = () => {
    apiGET(APIS.paths.defaultTo())
  };

  const [Route, setRoute] = useState(null)

  useEffect(() => {
    pullToRefresh();
  }, []);
  useEffect(() => {
    if(defaultTo){
      console.log("setRoute")
      setRoute(defaultTo.route)
    };
  }, [isLoading]);

  const onPressLogo = () => {
    // TODO:
  };
  const onPressPNList = () => {
    // initBadgeNum();
    navigation.navigate(NAV_NAMES.Home);
  };
  const onPressMyRoute = () => {
    navigation.navigate(NAV_NAMES.MainTab_Map);
  }

  const expandSearchTab = () => {
		dispatch(confirmCurrentRoute(false));
	}
  const onPressFind = () => {
    navigation.navigate(NAV_NAMES.MainTab_Map);
    expandSearchTab()
  }

  const calculatInitialMapRegion = () => {
		const bounds = Route?.bounds
		if (bounds){
			const { width, height } = Dimensions.get('window')
			const ASPECT_RATIO = width / height
			const latitude = (bounds.northeast.lat + bounds.southwest.lat) / 2;
			const longitude = ((bounds.northeast.lng + bounds.southwest.lng) /2) - 0.02;
			let longitudeDelta = (bounds.northeast.lng - bounds.southwest.lng);
			let latitudeDelta = (bounds.northeast.lng - bounds.southwest.lng);
			if (longitudeDelta - latitudeDelta > 0){
				latitudeDelta = longitudeDelta * ASPECT_RATIO;
			}{
				longitudeDelta = latitudeDelta / ASPECT_RATIO;
			}
			return {
				latitude: latitude,
				longitude: longitude,
				latitudeDelta: latitudeDelta,
				longitudeDelta: longitudeDelta,
			}}
		else {
			return {
				latitude: 37.5663,
				longitude: 126.9779,
				latitudeDelta: 0.5,
				longitudeDelta: 0.5,
			}
		}
	}

  return (
    <Div px20 flex bgGray100>
      {/** ========= HEADER =========== */}
      <Row h50 itemsCenter bgGray100 my5>
        <Col bgDanger>
          <Div onPress={onPressLogo} >
          </Div>
        </Col>
        <Col itemsCenter auto>
          <Div>
            
          </Div>
        </Col>
        <Col >
          <Row>
            <Col></Col>
            <Col auto>
              <Div relative onPress={onPressPNList} >
                {true && (
                  <Div absolute bgDanger w10 h10 rounded16 zIndex5 top={-3} right />
                )}
                <Img w25 h25 source={ICONS.blankProfile} />
              </Div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/** ========== BODY =========== */}
      <ScrollView
        flex={1}
        bgGray100
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={pullToRefresh} />
        }>
        <Row itemsCenter bgGray100 my5>
          <Col auto >
            <Div onPress={onPressLogo} >
              <Span fontSize={20}>뉴스</Span>
            </Div>
            <Div onPress={onPressLogo} my10>
              <CreditPackages/>
            </Div>
          </Col>
        </Row>
        <Row itemsCenter bgGray100 my5>
          <Col auto >
            <Div onPress={onPressLogo} >
              <Span fontSize={20}>Hot 순간</Span>
            </Div>
            <Div onPress={onPressLogo} my10 h100>
              <SunganCollection></SunganCollection>
            </Div>
          </Col>
        </Row>
        <Row itemsCenter bgGray100 my5>
          <Col>
            <Row onPress={onPressLogo} >
              <Col justifyEnd mr10><Span fontSize={20}>내 길</Span></Col>
              <Col></Col>
              <Col justifyEnd auto><Span >역삼동 793-18 / 강남 WeWork</Span></Col>
            </Row>
            <Col
              my10
              h200
              border
              borderGray300
              rounded6>
                
                <MapView  
                  mapPadding={{bottom: 50, top: 0, left: 0, right: 0}}
                  userLocationPriority={'high'}
                  showsBuildings={true}
                  showsUserLocation={true}
                  onPress={(e)=>onPressMyRoute()}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={calculatInitialMapRegion()} 
                  style={{
                    position: 'absolute',
                    left: -70,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}>
                  {Route && (
                    <MapViewDirections
                      route={Route}
                    />
                  )}
                </MapView>
                
            </Col>
          </Col>
        </Row>
        <Row itemsCenter bgGray100 my5>
          <Col>
            <Div onPress={onPressLogo} >
              <Span fontSize={20}>날씨</Span>
            </Div>
            <Col
              my10
              h200
              border
              borderGray300
              rounded6>
                <Row px10 py10>
                </Row>
            </Col>
          </Col>
        </Row>

      </ScrollView>
      <Div
      onPress={(e) => onPressFind()}>
        <Div bgWhite 
              absolute 
              right0 
              bottom10 
              w50 
              h50 
              borderRadius={60} 
              itemsCenter
              justifyCenter
              shadowColor={"#000"}
              shadowOffset= {{ width: 0, height: 2, }}
              shadowOpacity={0.25}>
          <Search stroke="#2e2e2e" fill="#fff" width={32} height={32}></Search>
        </Div>
      </Div>
    </Div>
  );
};

export default HomeScreen;
