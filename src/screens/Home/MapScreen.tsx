import React, {useState, useEffect} from 'react';
import {
	useNavigation
  } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Div } from 'src/components/common/Div';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import { Img } from 'src/components/common/Img';
import { IMAGES } from 'src/modules/images';
import { Span } from 'src/components/common/Span';
import { useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import { Dimensions } from 'react-native';
import SearchScreen from 'src/screens/SearchScreen'
import _ from "lodash";
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { shallowEqual } from 'react-redux';
import MapViewDirections from 'src/components/MapViewDirections';
import {confirmCurrentRoute, setUserSearchDestination, setUserSearchOrigin} from 'src/redux/pathReducer';
import {useDispatch} from 'react-redux';
import { Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ICONS } from 'src/modules/icons';
import { ChevronLeft, X } from 'react-native-feather';
import { NAV_NAMES } from 'src/modules/navNames';

const MapScreen = ({route}) => {
	const {data: defaultTo, isLoading} = useApiSelector(APIS.paths.defaultTo);
	const {data: searchResults, isLoading: isSearchLoading} = useApiSelector(APIS.paths.fetch);
	
	const dispatch = useDispatch();

	const navigation = useNavigation();

	const { origin, destination} = useSelector(
        (root: RootState) => (root.path.userSearch), shallowEqual
    );
	const CurrentRouteIndex = useSelector(
        (root: RootState) => (root.path.currentRouteIndex), shallowEqual
    );
	const currentRouteConfirmed = useSelector(
        (root: RootState) => (root.path.currentRouteConfirmed), shallowEqual
    );

	const Route = searchResults?.routes[CurrentRouteIndex] || defaultTo?.route

	// if(Route == defaultTo?.route){
	// 	setOrigin(defaultTo?.origin)
	// 	setDestination(defaultTo?.destination)
	// }

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

	const [ExpandHeader, setExpandHeader] = useState( false );
	const [HeaderAnimation, setHeaderAnimation] = useState('slideInDown')

	const toggle = () => {
		if (ExpandHeader){
			setHeaderAnimation('bounceOutUp')
		}else {
			setHeaderAnimation('slideInDown')
			setExpandHeader(true)
		}
	}

	const finishToggle = () => {
		if (HeaderAnimation == 'bounceOutUp'){
			setExpandHeader(false)
		}
	}

	const expandSearchTab = () => {
		navigation.navigate(NAV_NAMES.Search)
	}

	const onPressBack = () => {
		expandSearchTab()
	}

	const onPressExit = () => {
		navigation.navigate(NAV_NAMES.Home)
	}

	const Header = () => {
		return(
			<Div activeOpacity={1.0} auto>
			  <Row bgWhite h50 itemsCenter >
				{/* <Col auto itemsCenter p20 onPress={(e) => onPressBack()}>
					<ChevronLeft stroke="#2e2e2e" fill="#fff" width={18} ></ChevronLeft>
				</Col> */}
				<Col auto itemsCenter p20  >
					<X stroke="#ffffff" fill="#fff" width={18} ></X>
				</Col>
				<Col itemsCenter >
					<Row >
						<Col width={"45%"} onPress={(e) => expandSearchTab()}><Span>{origin && (origin.length > 15 ?  `${origin.substring(0, 12)}...` : origin)}</Span></Col>
						<Col width={"10%"} itemsCenter><Span> → </Span></Col>
						<Col width={"45%"} onPress={(e) => expandSearchTab()}><Span>{destination && (destination.length > 15 ?  `${destination.substring(0, 12)}...` : destination)}</Span></Col>
					</Row>
				</Col>
				<Col auto itemsCenter p20 onPress={(e) => onPressExit()} >
					<X stroke="#2e2e2e" fill="#fff" width={18} ></X>
				</Col>
			  </Row>
			  
			  {ExpandHeader && (
				<Animatable.View animation={HeaderAnimation} onAnimationEnd={(e) => finishToggle()} duration={200} style={{backgroundColor: "white", zIndex: -1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10,}}>
				<Row itemsCenter mt10 overflowScroll>
				  <Col>
					{Route && [Route].map((result, i) => {
						return (
							<Div borderBottom borderGray200 pb10 px20 key={i}>
								{result.legs[0].steps.map((step, index , arr)=>{

									const topProps = {borderTop: false}

									if (step.transit_details) 
									{	
										return (
											<Div key={index} {...topProps} my1 borderGray200>
												<Row my5 fontSize={15} justifyCenter>
													<Col w25 auto mr5 itemsCenter justifyCenter>
														<Div h25 w25 itemsCenter justifyCenter backgroundColor={step.transit_details.line.color} borderRadius={50}>
															{
																step.transit_details?.line?.vehicle?.name !== "버스" ? 
																(<Span white bold>{step.transit_details?.line?.short_name?.slice(0, -2)}</Span>)
																:
																(<Image style={{width: 15, height: 15, tintColor: "white"}} source={{ uri: `https:${step.transit_details.line.vehicle.icon}`}}></Image>)
															}
														</Div>
													</Col>
													<Col justifyCenter pb2>
														<Span>{step.transit_details.departure_stop.name}</Span>
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
												{
													<Row mt2 fontSize={15} justifyCenter >
														<Col w25 auto mr5 itemsCenter justifyCenter>
															<Div h15 w15 itemsCenter justifyCenter backgroundColor={step.transit_details.line.color} borderRadius={50}>
																<Div h5 w5 backgroundColor={"white"} borderRadius={10}></Div>
															</Div>
														</Col>
														<Col justifyCenter pb2>
															<Span>{step.transit_details.arrival_stop.name}</Span>
														</Col>
													</Row>
												}
											</Div>
										)
									}
									else{
										return (
											<Div key={index} {...topProps} borderGray200>
												{	
													(0 == index) &&
													<Row>
														<Col w25 auto mr5 itemsCenter justifyCenter>
															{
																<Div h15 w15 key={index} itemsCenter my1 justifyCenter backgroundColor={"silver"} borderRadius={50}>
																</Div>
															}
														</Col>
														<Col justifyCenter pb2>
															<Span >{step.html_instructions}</Span>
														</Col>
													</Row>
												}
												<Row fontSize={15} justifyCenter>
													<Col w25 auto mr5 itemsCenter justifyCenter>
														{
															[1, 2, 3, 4].map((index) => {
																return(
																	<Div h5 w5 key={index} itemsCenter my1 justifyCenter backgroundColor={"silver"} borderRadius={50}>
																	</Div>
																)
															})
														}
													</Col>
													<Col justifyCenter pb2>
														{/* <Span fontSize={10}>{step.html_instructions}</Span> */}
													</Col>
												</Row>
												{	
													(arr.length - 1 == index) &&
													<Row>
														<Col w25 auto mr5 itemsCenter justifyCenter>
															{
																<Div h15 w15 key={index} itemsCenter my1 justifyCenter backgroundColor={"silver"} borderRadius={50}>
																</Div>
															}
														</Col>
														<Col justifyCenter pb2>
															<Span>{step.html_instructions}</Span>
														</Col>
													</Row>
												}
											</Div>
										)
									}
								})}
							</Div>
						)
					})}
				  </Col>
				</Row>
				</Animatable.View>
				)}
			</Div>
		)
	}

  	return (

		<Div flex={1}>
			<MapView  
				mapPadding={{bottom: 0, top: 0, left: 0, right: 0}}
				userLocationPriority={'high'}
				showsBuildings={true}
				showsMyLocationButton={true}
				showsUserLocation={true}
				onPress={(e)=>toggle()}
				provider={PROVIDER_GOOGLE}
				initialRegion={calculatInitialMapRegion()} 
				style={{
					position: 'absolute',
					left: -60,
					right: 0,
					top: 30,
					bottom: 0,
				}}>
				{Route && (
					<MapViewDirections
						route={Route}
					/>
				)}
			</MapView>
			<Div flex={1} pointerEvents={'box-none'}>
				<Header ></Header>
				<Div collapsable flex={1} pointerEvents={'none'}></Div>
			</Div>
		</Div>

	)
}


export default MapScreen;
