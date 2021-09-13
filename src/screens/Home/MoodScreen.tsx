import {
useNavigation
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
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
import { ScrollView, View } from 'src/modules/viewComponents';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import { useDispatch } from 'react-redux';
import { Map, PlusSquare, Menu, Plus, Code, Bell } from 'react-native-feather';
import RouteShelf from 'src/components/RouteShelf';
  
  const MoodScreen = (props) => {
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

    const onPressFind = () => {

    }
   
  
    return (
      <Div flex backgroundColor={"white"}>
        <RouteShelf></RouteShelf>
        {/** ========== BODY =========== */}
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={pullToRefresh} />
          }>
          <Div px20 relative >
            <Row py20 mt10>
              <Col ><Span medium fontSize={20}>순간적 기분</Span></Col>
              <Col></Col>
            </Row>
            {["😀", "🙃", "🤩", "😜", "🤭", "😱"].map((emoji, index) => {
              return(
                <Row
                itemsCenter 
                my10
                backgroundColor={'rgb(242, 242, 247)'}
                overflow={'hidden'}
                rounded20
                key={index}
                >
                  <Col>
                    <Row itemsCenter my10 pt20 pb10 px20>
                      <Col auto>
                        <Span medium fontSize={15}>irlglo</Span>
                      </Col>
                      <Col>
                      </Col>
                      <Col auto rounded20 backgroundColor={"#0d3692"} px10 py5>
                        <Span medium fontSize={15} white>1호선</Span>
                      </Col>
                    </Row>
                    <Row itemsCenter>
                      <Row>
                        <Col></Col>
                        <Col auto><Span key={index} fontSize={100}>{emoji}</Span></Col>
                        <Col></Col>
                      </Row>
                    </Row>
                    <View onPress={onPressLogo} py15 px20 backgroundColor={'rgb(225, 225, 227)'}>
                      <Row mb10>
                        <Col justifyEnd auto ><Span medium color={"rgb(66, 66, 66)"} bold>에바야...</Span></Col>
                        <Col></Col>
                      </Row>
                      <Row>
                        <Col justifyEnd auto ><Span medium color={"rgb(66, 66, 66)"}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas dolorum nam dolores, incidunt veniam nisi? Facilis iure quae, voluptatem recusandae reprehenderit qui necessitatibus laborum voluptatibus quia asperiores voluptate accusantium odio?</Span></Col>
                        <Col></Col>
                      </Row>
                    </View>
                  </Col>
                </Row>
              )
            })}
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
            <Plus stroke="white" fill="#fff" strokeWidth={1.2} width={30} height={30}></Plus>
          </Div>
        </Div>
      </Div>
    );
  };
  
  export default MoodScreen;
  