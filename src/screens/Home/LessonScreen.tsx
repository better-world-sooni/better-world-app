import React, {useState, useEffect, useRef} from 'react';
import { useLocale } from "src/i18n/useLocale";
import { s_common } from "src/i18n/text/s_common";
import { NAV_NAMES } from 'src/modules/navNames';
import { useApiSelector } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import { Div } from 'src/components/common/Div';
import { Dimensions, StyleSheet } from 'react-native';
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

  return (
    <Div flex={1}>
      <Span>Hello</Span>
      <MapView  
        provider={PROVIDER_GOOGLE}
        initialRegion={MapCenter} 
        style={StyleSheet.absoluteFill}>
        {/* {Coordinates.map((coordinate, index) =>
          <Marker key={`coordinate_${index}`} coordinate={coordinate} />
        )} */}
        {(Coordinates.length >= 2) && (
          <MapViewDirections
            origin={"서울대학교"}
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
    </Div>
  )
}

export default LessonScreen;
