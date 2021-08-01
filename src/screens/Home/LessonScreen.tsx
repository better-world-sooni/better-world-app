import React, {useState, useEffect} from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Div } from 'src/components/common/Div';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import { Img } from 'src/components/common/Img';
import { IMAGES } from 'src/modules/images';
import { Span } from 'src/components/common/Span';
import { useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import SearchScreen from 'src/screens/SearchScreen'
import _ from "lodash";
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { shallowEqual } from 'react-redux';
import MapViewDirections from 'src/components/MapViewDirections';
import {confirmCurrentRoute} from 'src/redux/pathReducer';
import {useDispatch} from 'react-redux';

// import GetLocation from 'react-native-get-location'
//   useEffect(() => {
	  // initialRegion();
//   })
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



const LessonScreen = ({route}) => {
	const {data: searchResults, isLoading: isSearchLoading} = useApiSelector(APIS.paths.fetch);
	const {data: defaultRoute, isLoading} = useApiSelector(APIS.paths.default);
	const apiGET = useReloadGET();
	const dispatch = useDispatch();
	useEffect(() => {
		apiGET(APIS.paths.default())
	}, []);

	const { origin, destination} = useSelector(
        (root: RootState) => (root.path.userSearch), shallowEqual
    );
	const CurrentRouteIndex = useSelector(
        (root: RootState) => (root.path.currentRouteIndex), shallowEqual
    );
	const currentRouteConfirmed = useSelector(
        (root: RootState) => (root.path.currentRouteConfirmed), shallowEqual
    );

	const calculatInitialMapRegion = () => {
		const bounds = searchResults?.routes[CurrentRouteIndex].bounds
		if (bounds){
			const { width, height } = Dimensions.get('window')
			const ASPECT_RATIO = width / height
			const latitude = (bounds.northeast.lat + bounds.southwest.lat) / 2;
			const longitude = (bounds.northeast.lng + bounds.southwest.lng) /2;
			const longitudeDelta = (bounds.northeast.lng - bounds.southwest.lng)*2;
			const latitudeDelta = longitudeDelta * ASPECT_RATIO;
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
				latitudeDelta: 1,
				longitudeDelta: 1,
			}
		}
	}

	const [mapRegion, setMapRegion] = useState(null)

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

	const expandSearchTab = () => {
		dispatch(confirmCurrentRoute(false));
	}

	const Header = () => {
		return(
			<Div activeOpacity={1.0} auto >
			  <Animated.View style={{height: 1, transform: [{scaleY: AnimatedStyles.animationValue}], alignContent: "center", backgroundColor: "white", borderBottomLeftRadius: 30, borderBottomRightRadius: 30}} >
			  </Animated.View>
			  <Row bgWhite h50 itemsCenter borderBottomLeftRadius={30} borderBottomRightRadius={30} >
				<Col itemsCenter onPress={(e)=> expandSearchTab()}><Span bold>{origin}</Span></Col>
				<Col auto itemsCenter>
				  <Span>→</Span>
				</Col>
				<Col itemsCenter onPress={(e)=> expandSearchTab()}><Span bold>{destination}</Span></Col>
			  </Row>
			  {ExpandHeader[1] && (
				<Row itemsCenter {...ExpandHeader[1]}>
				  <Col>
					{searchResults?.routes.length && 
					searchResults.routes[CurrentRouteIndex].legs[0].steps.map((step, index) => {
						return(<Row my15 key={index}>
									<Col mx20>
										<Row>
											<Col auto>
												<Row ><Span bold>{step.html_instructions}</Span></Row>
												{step.transit_details && <Row><Span red>{step.transit_details?.line.short_name}</Span></Row>}
											</Col>
											<Col ml5>
												<Row my5>
													{step.travel_mode == "WALKING" ? (
														_.range(1).map((i) => {
															return(<Col mx2 h10 key={i} borderRadius={1} backgroundColor={"grey"}></Col>)
														})
													):
														<Col h10 borderRadius={1} backgroundColor={step.transit_details?.line.color}></Col>}
												</Row>
												{step.transit_details &&
													<Row>
														<Col itemsStart auto><Span>{step.transit_details.arrival_stop.name}</Span></Col>
														<Col itemsCenter></Col>
														<Col itemsEnd auto><Span>{step.transit_details.departure_stop.name}</Span></Col>
													</Row>
												}
											</Col>
										</Row>
										{false && <Row ><Col itemsCenter><Span>{step.transport_num}</Span></Col></Row>}
									</Col>
							</Row>)
						})}
				  </Col>
				</Row>
				)}
			</Div>
		)
	}

  	return (
		<>
			{currentRouteConfirmed ?
			(<Div flex={1}>
				<MapView  
					onPress={(e)=>toggle()}
					provider={PROVIDER_GOOGLE}
					initialRegion={calculatInitialMapRegion()} 
					style={StyleSheet.absoluteFill}>
					{searchResults && (
						<MapViewDirections
							route={searchResults.routes[CurrentRouteIndex]}
						/>
					)}
				</MapView>
				<Div flex={1} pointerEvents={'box-none'}>
					<Header ></Header>
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
			</Div>)
			:
			(<SearchScreen></SearchScreen>)
			}
		</>
	)
}


export default LessonScreen;
