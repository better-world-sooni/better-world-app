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
import { ChevronLeft, Crosshair, X } from 'react-native-feather';
import { NAV_NAMES } from 'src/modules/navNames';
import MapboxGL from '@react-native-mapbox-gl/maps';
import RouteShelf from 'src/components/RouteShelf';
import { HAS_NOTCH } from 'src/modules/contants';
import { View } from 'src/modules/viewComponents';

const MapScreen = ({route}) => {
	const shadowProp = {shadowOffset: {height: 1, width: 1}, shadowColor: "gray", shadowOpacity: 0.5, shadowRadius: 3}
	const {data: defaultTo, isLoading} = useApiSelector(APIS.route.default);
	const {data: searchResults, isLoading: isSearchLoading} = useApiSelector(APIS.paths.fetch);
	
	const dispatch = useDispatch();

	const navigation = useNavigation();

	const { origin, destination} = useSelector(
        (root: RootState) => (root.path.userSearch), shallowEqual
    );
	const CurrentRouteIndex = useSelector(
        (root: RootState) => (root.path.currentRouteIndex), shallowEqual
    );

	const Route = searchResults?.routes[CurrentRouteIndex] || defaultTo?.default_route.route

	useEffect(() => {
		setMapBounds(calculatInitialMapRegion())
	}, [searchResults?.routes[CurrentRouteIndex]])

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

	const [ExpandHeader, setExpandHeader] = useState( false );

	const toggle = () => {
		if (ExpandHeader){
			setExpandHeader(false)
		}else {
			setExpandHeader(true)
		}
	}

	const expandSearchTab = () => {
		navigation.navigate(NAV_NAMES.Search)
	}

	const Header = () => {
		return(
			<Div activeOpacity={1.0} w={"100%"} px20 {...shadowProp}>
			  <Row bgWhite h50 itemsCenter rounded20 overflowHidden mb10>
				<Col itemsCenter >
					<Row >
						<Col width={"45%"} onPress={(e) => expandSearchTab()} justifyCenter itemsCenter><Span>{origin && (origin.length > 20 ?  `${origin.substring(0, 15)}...` : origin)}</Span></Col>
						<Col itemsCenter auto><Span> → </Span></Col>
						<Col width={"45%"} onPress={(e) => expandSearchTab()}justifyCenter itemsCenter><Span>{destination && (destination.length > 20 ?  `${destination.substring(0, 15)}...` : destination)}</Span></Col>
					</Row>
				</Col>
				</Row>
				{ExpandHeader && (
					<Div bgWhite zIndex={-1} py20 rounded20>
					{Route && 
							<Div pb10 px20>
								{Route.legs[0].steps.map((step, index , arr)=>{
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
											<Div key={index} {...topProps}>
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
						}
				  </Div>
				)}
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
			// maxBounds={{
			// 	ne: [37.715133, 127.269311], 
			// 	sw:  [37.413294, 126.734086]
			// }}
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
