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
import { useLocale } from 'src/i18n/useLocale';
import APIS from 'src/modules/apis';
import { IMAGES } from 'src/modules/images';
import { NAV_NAMES } from 'src/modules/navNames';
import { FlatList, ScrollView, View } from 'src/modules/viewComponents';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import { useDispatch } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'src/components/MapViewDirections';
import { Dimensions } from 'react-native';
import { ICONS } from 'src/modules/icons';
import { confirmCurrentRoute } from 'src/redux/pathReducer';
import { Map, PlusSquare, Menu, Plus, ChevronRight, ArrowRight, Code, ChevronDown, Bell } from 'react-native-feather';
import LinearGradient from 'react-native-linear-gradient';

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
    navigation.navigate(NAV_NAMES.Map);
  }
  // const onPressSunganCam = () => {
  //   navigation.navigate(NAV_NAMES.SunganCam);
  // }
  const expandSearchTab = () => {
		dispatch(confirmCurrentRoute(false));
	}
  const onPressFind = () => {
    navigation.navigate(NAV_NAMES.Map);
    expandSearchTab()
  }
  const onPressMood = () => {
    navigation.navigate(NAV_NAMES.Mood)
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
    <Div flex
    backgroundColor={'white'}>
        {/** ========= HEADER =========== */}
      <Div px20 >
        <Row h40 itemsCenter >
          <Col auto rounded20 backgroundColor={'rgb(242, 242, 247)'} px10 py5>
            <Row itemsCenter justifyEnd>
              <Col auto><Span bold>역삼동 793-18</Span></Col>
              <Col auto mx10>
                <Code color={"black"} height={15}></Code>
              </Col>
              <Col auto><Span bold>강남 WeWork</Span></Col>
            </Row>
          </Col>
          <Col ></Col>
          <Col auto ml5>
            <Div relative onPress={onPressPNList} >
              {true && (
                <Div absolute bgDanger w10 h10 rounded16 zIndex5 top={-3} right />
              )}
              <Bell stroke="#2e2e2e" fill="#fff" strokeWidth={1.5} ></Bell>
            </Div>
          </Col>
        </Row>
      </Div>

      {/** ========== BODY =========== */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={pullToRefresh} />
        }>
        <Div relative>
          <Row
          itemsCenter 
          mt10
          >
            <Col>
              <Row itemsCenter px20 py20>
                <Col textCenter auto>
                  <Row ><Span medium fontSize={20}>순간</Span></Row>
                </Col>
                <Col></Col>
                <Col auto>
                  <Row>
                    <Col auto><Span>쭉보기</Span></Col>
                    <Col auto><ChevronRight color={"black"} height={22} /></Col>
                  </Row>
                </Col>
              </Row>
              <Row pl10>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {["😀", "🙃", "🤩", "😜", "🤭", "😱"].map((emoji, index) => {
                    return(
                      <Div
                        backgroundColor={'rgb(242, 242, 247)'}
                        overflow={'hidden'}
                        rounded20
                        mx10
                        w200
                      >
                        <Row>
                          <Col></Col>
                          <Col auto><Span key={index} fontSize={50}>{emoji}</Span></Col>
                          <Col></Col>
                        </Row>
                        <Row 
                        backgroundColor={'rgb(225, 225, 227)'}
                        px20
                        py10
                        >
                          <Col auto>
                            <Span color={"rgb(66, 66, 66)"} bold>개 망했다..</Span>
                          </Col>
                          <Col></Col>
                        </Row>
                      </Div>
                      
                    )
                  })}
                </ScrollView>
              </Row>
            </Col>
          </Row>
          <Row 
          itemsCenter 
          my20
          mx20
          >
            <Col>
              <Row itemsCenter py20>
                <Col textCenter auto>
                  <Row ><Span medium fontSize={20}>도착지로 순간이동</Span></Row>
                </Col>
                <Col></Col>
                <Col auto>
                  <Row>
                    <Col auto><Span>자세히</Span></Col>
                    <Col auto><ChevronRight color={"black"} height={22} /></Col>
                  </Row>
                </Col>
              </Row>
              <Row 
              itemsCenter
              backgroundColor={'rgb(255, 232, 196)'}
              overflow={'hidden'}
              rounded20>
                <Col >
                  <Row>
                    <Col>
                    <Row
                      h400
                      relative>
                        <MapView  
                          mapPadding={{bottom: 0, top: 0, left: 0, right: 0}}
                          userLocationPriority={'high'}
                          showsBuildings={true}
                          showsUserLocation={true}
                          showsMyLocationButton={true}
                          onPress={(e)=>onPressMyRoute()}
                          provider={PROVIDER_GOOGLE}
                          initialRegion={calculatInitialMapRegion()} 
                          style={{
                            position: 'absolute',
                            left: 0,
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
                        <Div absolute width={"100%"} top10>
                          <Row>
                            <Col></Col>
                            <Col justifyEnd bgWhite auto rounded50 shadowColor={"black"}>
                              <Span medium textCenter px10 py5 >
                                역삼동 793-18 / 강남 WeWork
                              </Span>
                            </Col>
                            <Col></Col>
                          </Row>
                        </Div>
                    </Row>
                  </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row
          itemsCenter 
          >
            <Col>
              <Row itemsCenter px20 py20>
                <Col textCenter auto>
                  <Row ><Span medium fontSize={20}>빌런/이슈 제보</Span></Row>
                </Col>
                <Col></Col>
                <Col auto>
                  <Row>
                    <Col auto><Span>전체</Span></Col>
                    <Col auto><ChevronRight color={"black"} height={22} /></Col>
                  </Row>
                </Col>
              </Row>
              <Row pl10>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {["⚠️", "🚨", "⚠️", "🚨", "⚠️", "🚨",].map((emoji, index) => {
                    return(
                      <Div
                        backgroundColor={'rgb(255, 224, 222)'}
                        overflow={'hidden'}
                        rounded20
                        mx10
                        w200
                      >
                        <Row>
                          <Col></Col>
                          <Col auto><Span key={index} fontSize={50}>{emoji}</Span></Col>
                          <Col></Col>
                        </Row>
                        <Row 
                        backgroundColor={'rgb(255, 191, 186)'}
                        px20
                        py10
                        >
                          <Col auto>
                            <Span color={"rgb(255, 59, 48)"} bold>공항도둑 지하철에서 발견.</Span>
                          </Col>
                          <Col></Col>
                        </Row>
                      </Div>
                      
                    )
                  })}
                </ScrollView>
              </Row>
            </Col>
          </Row>
        </Div>
      </ScrollView>
      <Div
      onPress={(e) => onPressFind()}>
        <Div bgDanger 
              absolute 
              right10
              bottom10 
              w50 
              h50 
              borderRadius={60} 
              itemsCenter
              justifyCenter
              shadowColor={"#000"}
              shadowOffset= {{ width: 0, height: 2, }}
              shadowOpacity={0.25}>
          <Plus stroke="white" fill="#ffffff" strokeWidth={1.2} width={30} height={30}></Plus>
        </Div>
      </Div>
    </Div>
  );
};

export default HomeScreen;
