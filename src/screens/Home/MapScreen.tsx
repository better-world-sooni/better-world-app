import React, {useState, useEffect, useRef} from 'react';
import {
	useNavigation
  } from '@react-navigation/native';
import { Div } from 'src/components/common/Div';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import { Span } from 'src/components/common/Span';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import _ from "lodash";
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { shallowEqual } from 'react-redux';
import MapViewDirections from 'src/components/MapViewDirections';
import { Animated, Dimensions, Easing, Image, RefreshControl } from 'react-native';
import { ChevronLeft, Crosshair, Grid, Star, X } from 'react-native-feather';
import { NAV_NAMES } from 'src/modules/navNames';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { HAS_NOTCH } from 'src/modules/contants';
import { shortenAddress } from 'src/modules/utils';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ScrollView } from 'react-native-gesture-handler';

const MapScreen = ({route}) => {
	const shadowProp = {shadowOffset: {height: 1, width: 1}, shadowColor: "gray", shadowOpacity: 0.5, shadowRadius: 3}
	const {data: starredResponse, isLoading} = useApiSelector(APIS.route.starred);
	const {data: directionsResponse, isLoading: isSearchLoading} = useApiSelector(APIS.directions.get);
	const defaultRoute = starredResponse?.data?.[0]
	const directions = directionsResponse?.data

	const navigation = useNavigation();
	const apiPOST = useApiPOST()

	const { origin, destination} = useSelector(
        (root: RootState) => (root.path.userSearch), shallowEqual
    );
	const CurrentRouteIndex = useSelector(
        (root: RootState) => (root.path.currentRouteIndex), shallowEqual
    );

	const Route = directions?.routes[CurrentRouteIndex] || defaultRoute?.route

	useEffect(() => {
		setMapBounds(calculatInitialMapRegion())
	}, [directions?.routes[CurrentRouteIndex]])

	const calculatInitialMapRegion = () => {
		const bounds = Route?.bounds
		if (bounds){
			return {
			ne: [
			bounds.northeast.lng, 
			bounds.northeast.lat,
			], 
			sw: [
			bounds.southwest.lng,
			bounds.southwest.lat, 
			]
		}
		}
		else {
			return {
				ne: [37.715133, 127.269311], 
        		sw:  [37.413294, 126.734086],
			}
		}
	}

	const [mapBounds, setMapBounds] = useState(calculatInitialMapRegion())

	const [userCoordinates, setUserCoordinates] = useState(null)

	const [ExpandHeader, setExpandHeader] = useState( true );

	const toggle = () => {
		if (ExpandHeader) {
			startAnimation(0, () => setExpandHeader(false))
		} else{
			setExpandHeader(true)
		}
	}

	const goToSearch = () => navigation.navigate(NAV_NAMES.Search)

	const postDefaultRoute = () => {
		apiPOST({
			main: false,
			route: Route
		})
	}

	const iconSettings = {
		strokeWidth:2,
		color: "black", 
		height: 20,
	}

	const animatedValue = useRef(new Animated.Value(0)).current;

	const startAnimation = (toValue, callback?) => {
		Animated.timing(animatedValue, {
			toValue,
			duration: 500,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start(callback)
	}

	function translateX(index) {
		return animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [Dimensions.get('window').width + (index * 100), 0],
			extrapolate: 'clamp'
		})
	}
	

	const Header = () => {

		useEffect(()=> {
			ExpandHeader && startAnimation(1)
		}, [ExpandHeader])

		return(
			<Div activeOpacity={1.0} w={"100%"} px20 {...shadowProp} pointerEvents="box-none">
			  <Row bgWhite h50 itemsCenter rounded20 overflowHidden mb10>
				<Col itemsCenter >
					<Row >
						<Col width={"45%"} onPress={(e) => goToSearch()} justifyCenter itemsCenter><Span bold numberOfLines={1} ellipsizeMode='head' px10>{origin}</Span></Col>
						<Col itemsCenter auto><Span> → </Span></Col>
						<Col width={"45%"} onPress={(e) => goToSearch()}justifyCenter itemsCenter><Span bold numberOfLines={1} ellipsizeMode='head' px10>{destination}</Span></Col>
					</Row>
				</Col>
				</Row>
				{ExpandHeader && (
					<Div zIndex={-1} >
					{Route && 
							<ScrollView
							pointerEvents="box-none" 
							showsVerticalScrollIndicator={false}
							refreshControl={
								<RefreshControl
								  refreshing={!ExpandHeader}
								  onRefresh={() => startAnimation(0, () => setExpandHeader(false))}
								/>
							  }
							>
								{Route.legs[0].steps.map((step, index )=>{
									const topProps = {borderTop: false}
									if (step.transit_details) 
									{	
										return (
											<Animated.View key={index} style={[{ transform: [{ translateX: translateX(index) }] }]} >
												<Row  {...topProps} my1 borderGray200 bgWhite rounded20 py10 px20 my5 justifyCenter>
													<Col hFull>
														<Row my5 fontSize={15} justifyCenter>
															<Col w25 auto mr5 itemsCenter justifyCenter>
																	{
																		step.transit_details?.line?.vehicle?.name !== "버스" ? 
																		(
																			<Div h25 w25 itemsCenter justifyCenter backgroundColor={step.transit_details.line.color} borderRadius={50}>
																				<Span white bold>{step.transit_details?.line?.short_name?.slice(0, -2)}</Span>
																			</Div>
																		)
																		:
																		(<FontAwesomeIcon icon="bus" color={step.transit_details.line.color}></FontAwesomeIcon>)
																	}
															</Col>
															<Col justifyCenter pb2>
																<Span>{step.transit_details.departure_stop.name.split(".")[0]}</Span>
															</Col>
														</Row>
														{   
															step.transit_details?.line?.vehicle?.name == "버스" &&
															<Row my3>
																<Col w25 auto mr5 itemsCenter justifyCenter>
																</Col>
																<Col justifyCenter mr5 auto>
																	<Div  backgroundColor={step.transit_details.line.color} borderRadius={5} px5>
																		<Span fontSize={10} white>{step.transit_details.line.name.split(" ").pop().slice(0,2)}</Span>
																	</Div>
																</Col>
																<Col auto pb2>
																	<Span >{step.transit_details.line.short_name}</Span>
																</Col>
																<Col></Col>
															</Row>
														}
														<Row mt2 fontSize={15} justifyCenter >
															<Col w25 auto mr5 itemsCenter justifyCenter>
																<Div h15 w15 itemsCenter justifyCenter backgroundColor={step.transit_details.line.color} borderRadius={50}>
																	<Div h5 w5 backgroundColor={"white"} borderRadius={10}></Div>
																</Div>
															</Col>
															<Col justifyCenter pb2>
																<Span>{step.transit_details.arrival_stop.name.split(".")[0]}</Span>
															</Col>
														</Row>
													</Col>
													<Col auto itemsCenter justifyCenter>
														<Grid {...iconSettings}></Grid>
													</Col>
												</Row>
											</Animated.View>
										)
									}
									else{
										return (
											<Animated.View key={index} style={[{ transform: [{ translateX: translateX(index) }] }]}>
												<Div {...topProps} bgWhite rounded20 py10 px20 my5 justifyCenter>
													<Row>
														<Col w25 auto mr5 itemsCenter justifyCenter>
															<FontAwesomeIcon icon="walking"></FontAwesomeIcon>
														</Col>
														<Col justifyCenter pb2>
															<Span >{shortenAddress(step.html_instructions)}</Span>
														</Col>
													</Row>
												</Div>
											</Animated.View>
										)
									}
								})}
								<Animated.View style={[{ transform: [{ translateX: translateX(Route.legs[0].steps.length) }] }]}>
									<Row pointerEvents="box-none" >
										<Col pointerEvents="none" pr10 py10 rounded20 itemsCenter><Span>끌어내려서 맵보기</Span></Col>
										<Col auto px10 py10 rounded20 bgWhite onPress={postDefaultRoute}><Star {...iconSettings}></Star></Col>
									</Row>
								</Animated.View>
								{/* <Div h={200} pointerEvents="none"></Div> */}
							</ScrollView>
						}
				  </Div>
				)}
				{!ExpandHeader && <Row pointerEvents="box-none" >
					<Col pointerEvents="none" ></Col>
					<Col auto px10 py10 rounded20 bgWhite onPress={postDefaultRoute}><Star {...iconSettings}></Star></Col>
				</Row>}
			</Div>
		)
	}

  	return (
	<Div flex
		relative
		>
      <MapboxGL.MapView
        style={{flex: 1}} 
        styleURL={"mapbox://styles/nomacguffins/cktjvxy3m0sd017qwn660ct0g"}
        logoEnabled={false}
		attributionPosition={{bottom: 10, left:20}}
        compassEnabled={false}
		onPress={toggle}
        >
          <MapboxGL.UserLocation
		  onUpdate={(payload) => {setUserCoordinates(payload)}}
		  androidRenderMode="compass"
		  ></MapboxGL.UserLocation>
          <MapboxGL.Camera 
			defaultSettings={{bounds: calculatInitialMapRegion()}}
			bounds={mapBounds}
			zoomLevel={11}></MapboxGL.Camera>
          {Route && (
            <MapViewDirections
              route={Route}
            />
          )}
      </MapboxGL.MapView>
      <Div absolute h={"100%"} w={"100%"}  pointerEvents="box-none" flex>
	  	<Div h={HAS_NOTCH ? 44 : 20} />
		<Header></Header>
        <Row flex pointerEvents="none">
        </Row>
        <Row pointerEvents="box-none" px20 py10>
          <Col pointerEvents="none"></Col>
          <Col 
		  itemsCenter 
		  justifyCenter 
		  rounded100 
		  w50 
		  h50 
		  bgWhite 
		  auto 
		  {...shadowProp} 
		  onPress={
			  ()=>setMapBounds({
					  ne: [userCoordinates.coords.longitude+0.001, userCoordinates.coords.latitude+0.001],
					  sw: [userCoordinates.coords.longitude-0.001, userCoordinates.coords.latitude-0.001]
				})}>
			<Crosshair color={"black"} strokeWidth={2}></Crosshair>
		  </Col>
        </Row>
      </Div>
    </Div>
	)
}


export default MapScreen;
