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
import { FlatList, ScrollView, View } from 'src/modules/viewComponents';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import { useDispatch } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'src/components/MapViewDirections';
import { Dimensions } from 'react-native';
import { ICONS } from 'src/modules/icons';
import { confirmCurrentRoute } from 'src/redux/pathReducer';
import { Map, PlusSquare, Menu, Plus, ChevronRight, ArrowRight, Code, ChevronDown, Bell, Info, Lock, Send, Folder, Edit, Rss } from 'react-native-feather';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = (props) => {
    const {data: defaultTo, isLoading} = useApiSelector(APIS.paths.defaultTo);
    const navigation = useNavigation();
    const apiGET = useReloadGET();
    const apiPOST = useApiPOST();
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
        <Div flex backgroundColor={"white"}>
            <ScrollView
                flex={1}
                showsVerticalScrollIndicator={false}
                refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={pullToRefresh} />
                }>
                <Div relative px20>
                    <Row h40 itemsCenter >
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
                    <Row
                    itemsCenter 
                    mt10
                    >
                        <Col></Col>
                        <Col auto>
                            <Row rounded100 overflowHidden>
                                <Img source={IMAGES.example2} h200 w200></Img>
                            </Row>
                            <Row py20>
                                <Col></Col>
                                <Col auto><Span bold fontSize={20}>irlyglo</Span></Col>
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
                    py10
                    >
                        <Col>
                            <Row py10>
                                <Col auto mr5><Info color={"black"} strokeWidth={1.5}></Info></Col>
                                <Col auto><Span fontSize={15}>개인정보</Span></Col>
                                <Col></Col>
                            </Row>
                            <Row py10>
                                <Col auto mr5><Lock color={"black"} strokeWidth={1.5}></Lock></Col>
                                <Col auto><Span fontSize={15}>보안</Span></Col>
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
                    py10
                    >
                        <Col>
                            <Row py10>
                                <Col auto mr5><Map color={"black"} strokeWidth={1.5}></Map></Col>
                                <Col auto><Span fontSize={15}>자주가는 길</Span></Col>
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
                    py10
                    >
                        <Col>
                            <Row py10>
                                <Col auto mr5><Edit color={"black"} strokeWidth={1.5}></Edit></Col>
                                <Col auto><Span fontSize={15}>글</Span></Col>
                                <Col></Col>
                            </Row>
                            <Row py10>
                                <Col auto mr5><Rss color={"black"} strokeWidth={1.5}></Rss></Col>
                                <Col auto><Span fontSize={15}>순간 드랍</Span></Col>
                                <Col></Col>
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

export default ProfileScreen;
  