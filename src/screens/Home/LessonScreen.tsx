import React, {useState, useEffect, useRef} from 'react';
import { useLocale } from "src/i18n/useLocale";
import { s_common } from "src/i18n/text/s_common";
import { NAV_NAMES } from 'src/modules/navNames';
import { useApiSelector } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import { Div } from 'src/components/common/Div';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import { Img } from 'src/components/common/Img';
import { IMAGES } from 'src/modules/images';
import { Animated, View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'src/components/MapViewDirections';
import { Span } from 'src/components/common/Span';
// import GetLocation from 'react-native-get-location'
 

const LessonScreen = ({route}) => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyAKr85NZ139cK6XvE_UExdhmtfivHiG8qE';
  const { t } = useLocale();
  const MapViewRef = useRef(null);
  // const initialRegion = async () => {
  //   const location =  await GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 15000,
  //   })
  //   if (location){
  //     setMapCenter( {
  //         latitude: location.latitude,
  //         longitude: location.longitude,
  //         latitudeDelta: location.accuracy,
  //         longitudeDelta: location.accuracy,
  //     })
  //   }
  //   else{
  //     setMapCenter( {
  //       latitude: 37.517235,
  //       longitude: 127.047325,
  //       latitudeDelta: 0.0922,
  //       longitudeDelta: 0.0421,
  //     } )
  //   }
  // }

  const [MapCenter, setMapCenter] = useState({
    latitude: 37.517235,
    longitude: 127.047325,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const [Coordinates, setCoordinates] = useState([
        {
          latitude: 37.517235,
          longitude: 127.047325,
        },
        {
          latitude: 37.5317,
          longitude: 127.0303,
        },
      ])

  useEffect(() => {
    // initialRegion();
  }, []);

  const on = {
    bgWhite: true,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius:30,
  }
  const off = false
  const [ExpandHeader, useExpandHeader] = useState([on, off]);
  const [AnimatedStyles, setAnimatedStyles] = useState({
    animationValue : new Animated.Value(1),
    viewState : true
  })

  const toggle = () => {
    if (AnimatedStyles.viewState){
      Animated.timing(AnimatedStyles.animationValue, {
        useNativeDriver: true,
        toValue : 350,
        duration : 50
      }).start(()=>{
        setAnimatedStyles({
          animationValue : new Animated.Value(350),
          viewState : false
        })
      });
      setTimeout(() => {useExpandHeader([off, on])}, 40);
      }
    else{
      useExpandHeader([on, off]);
      Animated.timing(AnimatedStyles.animationValue, {
        useNativeDriver: false,
        toValue : 1,
        duration : 50
      }).start(()=>{
        setAnimatedStyles({
          animationValue : new Animated.Value(1),
          viewState : true
        })
      });
      }
  }

  const Header = () => {

    return(
        <Div activeOpacity={1.0} auto onPress={(e)=> console.log()} >
          <Animated.View style={{height: 1, transform: [{scaleY: AnimatedStyles.animationValue}], alignContent: "center", backgroundColor: "white", borderBottomLeftRadius: 30, borderBottomRightRadius: 30}} >
          </Animated.View>
          <Row bgWhite h50 itemsCenter borderBottomLeftRadius={30} borderBottomRightRadius={30}>
            <Col itemsCenter><Span>서울대학교</Span></Col>
            <Col auto items center>
              <Span>→</Span>
            </Col>
            <Col itemsCenter><Span>강남 위워크</Span></Col>
          </Row>
          {ExpandHeader[1] && (
            <Row h200 itemsCenter {...ExpandHeader[1]}>
              <Col>
                {[1,2,3].map((step, index) => {
                  return(<Row key={index}><Span>Hello</Span></Row>)
                })}
              </Col>
            </Row>
            )}
        </Div>
    )
  }

  return (
    <Div flex={1}>
      <MapView  
        onPress={(e)=>toggle()}
        provider={PROVIDER_GOOGLE}
        initialRegion={MapCenter} 
        style={StyleSheet.absoluteFill}>
        {/* {Coordinates.map((coordinate, index) =>
          <Marker key={`coordinate_${index}`} coordinate={coordinate} />
        )} */}
        {(Coordinates.length >= 2) && (
          <MapViewDirections
            origin={"역삼동 793-18"}
            // waypoints={ (Coordinates.length > 2) ? Coordinates.slice(1, -1): null}
            destination={"강남 위워크"}
            apikey={GOOGLE_MAPS_APIKEY}
            precision="low"
            mode="TRANSIT"
            language="ko"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`)
              console.log(`Duration: ${result.duration} min.`)
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
            alternatives={true}
          />
        )}
      </MapView>
      <Div flex={1} pointerEvents={'box-none'}>
          <Header></Header>
          <Div collapsable flex={1} pointerEvents={'none'}></Div>
          <Div bgWhite h50 borderTopLeftRadius={30} borderTopRightRadius={30}>
            <Row>
              <Col></Col>
              <Col auto >
                <Img w21 h50 source={IMAGES.mainLogo} />
              </Col>
              <Col></Col>
            </Row>
          </Div>
      </Div>
    </Div>
  )
}

export default LessonScreen;
