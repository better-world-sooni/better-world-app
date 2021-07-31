import React, {useState, useEffect, useRef, Fragment, FC, ReactElement} from 'react';
import { useLocale } from "src/i18n/useLocale";
import { s_common } from "src/i18n/text/s_common";
import { NAV_NAMES } from 'src/modules/navNames';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import { Div } from 'src/components/common/Div';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import { Img } from 'src/components/common/Img';
import { IMAGES } from 'src/modules/images';
import { Animated, View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import MapView, { Circle, Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Span } from 'src/components/common/Span';
import { NativeBaseProvider, TextField } from 'native-base';
import _ from "lodash"
// import GetLocation from 'react-native-get-location'

const WAYPOINT_LIMIT = 10;

interface Props {
    origin: string;
	destination: string;
	waypoints?: Array<any>;
	mode?: 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING';
	splitWaypoints?: boolean;
	resetOnChange?: boolean;
	optimizeWaypoints?: boolean;
	directionsServiceBaseUrl?: string;
	precision?: 'high' | 'low';
	timePrecision?: 'high' | 'low';
	strokeWidth?: number;
	channel?: string;
	apikey: string; 
	onStart?: Function;
	onReady?: Function; 
	onError?: Function;
	language?: string; 
	region?: string; 
	alternatives?: boolean
}

interface LatLng {
	latitude: number,
	longitude: number
}

interface Step {
	coordinates: any;
	distance: number;
	duration: number;
	travel_mode: string;
	transport_num: string;
	transport_desc: string;
	vehicle: string;
	color: string;
	start_location: string;
	end_location: string;
	html_instructions: string;
	departure_stop: string;
	arrival_stop: string;
}

interface MapViewDirectionsProps { 
	steps: Array<Step>, 
	origin: LatLng, 
	destination: LatLng 
}

interface State {
	steps: Array<Step>
	origin: LatLng
	destination: LatLng
}

const MapViewDirections: FC<MapViewDirectionsProps> = (props): ReactElement => {

	const { steps: Steps, origin: Origin, destination: Destination } = props;

	if ( !Steps ) {
		return null;
	}

	const CircleFix = ({step}) => {
		const circleRef = useRef(null);
		return(
			step.coordinates &&
				<Circle 
					onLayout={() => (circleRef.current.setNativeProps({
						strokeColor: "grey",
						fillColor: "white"
						}))}
					center={step.coordinates[step.coordinates.length-1]} 
					radius={30} 
					fillColor={null} 
					strokeWidth={4} 
					strokeColor={null}
					zIndex={10}
					ref={circleRef}/>	
		)
	}
	

	const polylineConditionalProps = (step) => {
		if (step.travel_mode == "WALKING"){
			return {
				strokeWidth: 5,
				strokeColor: "grey",
				// strokeColor: "#33b8ff",
				lineDashPattern: [10,10]
			}
		}
		else{
			return {
				strokeWidth: 7,
				strokeColor: step.color,
			}
		}
	}

	const PatternedPolyline = ({step}) => {
		return(
			<>
				<Polyline miterLimit={90} tappable lineJoin={'miter'} coordinates={step.coordinates} strokeWidth={10} strokeColor={"white"} {...props} />
				<Polyline miterLimit={90} tappable lineJoin={'miter'} coordinates={step.coordinates} {...polylineConditionalProps(step)} {...props} />
			</>
		)
	}
	
	return (
		<>
		{Origin && <Marker title={"출발"} pinColor={"blue"} coordinate={Origin}></Marker>}
		{Steps.map( (step, index) => {
				return (
				<Fragment key={index}>
					{step.coordinates && (index == 0) && <CircleFix step={{coordinates: [step.coordinates[0]]}}/>}
					<PatternedPolyline step={step}/>
					<CircleFix step={step}/>
				</Fragment>)
		}) }
		{Destination && <Marker title={"도착"} coordinate={Destination}></Marker>}
		</>
	);
}


const LessonScreen = ({route}) => {
	const GOOGLE_MAPS_APIKEY = 'AIzaSyAKr85NZ139cK6XvE_UExdhmtfivHiG8qE';
	const { t } = useLocale();
	const MapViewRef = useRef(null);
	const apiGET = useReloadGET();
	const {data: defaultRoute, isLoading} = useApiSelector(APIS.paths.default);
  
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

	const props: Props = {
		origin: "동국대학교",
		waypoints: [],
		destination: "역삼동 793-18",
		apikey: GOOGLE_MAPS_APIKEY,
		precision: "low",
		mode: "TRANSIT",
		language: "ko",
		onStart: (params) => {
			console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
		},
		onReady: (result) => {
		console.log(JSON.stringify(result))
		console.log(`Distance: ${result.distance/10} km`)
		console.log(`Duration: ${result.duration} min.`)
		},
		onError: (errorMessage) => {
			console.log('GOT AN ERROR');
		},
		alternatives: true
	}

  	const [{
		origin,
		destination,
		waypoints,
		mode,
		precision,
		apikey,
		onStart,
		onReady,
		onError,
		language,
		alternatives
	}, setMapState] = useState(props)

	useEffect(() => {
		// initialRegion();
		apiGET(APIS.paths.default())
	}, []);

	useEffect(() => {
		// if (!isLoading){
		// 	setRoute( defaultRoute );
		// }else{
		// 	resetState();
		// }
		fetchAndRenderRoute( props )
	}, [])

	// useEffect(() => {
	// 	fetchAndRenderRoute( props );
	// }, [origin, destination, waypoints, mode, precision])

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

  	const [State, setState] = useState<State>({
		steps: [{
			coordinates: null,
			distance: null,
			duration: null,
			travel_mode: null,
			transport_num: null,
			transport_desc: null,
			vehicle: null,
			color: null,
			start_location: null,
			end_location: null,
			html_instructions: null,
			departure_stop: null,
			arrival_stop: null,
		}],
		origin: {latitude: 0, longitude: 0},
		destination: {latitude: 0, longitude: 0}
	});

	const resetState = () => {
		setState( {
			steps: [{
				coordinates: null,
				distance: null,
				duration: null,
				travel_mode: null,
				transport_num: null,
				transport_desc: null,
				vehicle: null,
				color: null,
				start_location: null,
				end_location: null,
				html_instructions: null,
				departure_stop: null,
				arrival_stop: null,
			}],
		origin: {latitude: 0, longitude: 0},
		destination: {latitude: 0, longitude: 0}
		});
	}

	const setRoute = (route) => {
		if (route){
			const start_location = route[0].start_location
			const end_location = route[route.length-1].end_location
			setState( 
				{steps: route,
				origin: {latitude: start_location.lat, longitude: start_location.lng},
				destination: {latitude: end_location.lat, longitude: end_location.lng}}
			);
			if ( onReady ) {
				onReady( route );
			}
		}
	}

	const decode = ( t ) => {
		let points = [];
		for ( let step of t ) {
			let encoded = step.polyline.points;
			let index = 0, len = encoded.length;
			let lat = 0, lng = 0;
			while ( index < len ) {
				let b, shift = 0, result = 0;
				do {
					b = encoded.charAt( index++ ).charCodeAt( 0 ) - 63;
					result |= ( b & 0x1f ) << shift;
					shift += 5;
				} while ( b >= 0x20 );

				let dlat = ( ( result & 1 ) != 0 ? ~( result >> 1 ) : ( result >> 1 ) );
				lat += dlat;
				shift = 0;
				result = 0;
				do {
					b = encoded.charAt( index++ ).charCodeAt( 0 ) - 63;
					result |= ( b & 0x1f ) << shift;
					shift += 5;
				} while ( b >= 0x20 );
				let dlng = ( ( result & 1 ) != 0 ? ~( result >> 1 ) : ( result >> 1 ) );
				lng += dlng;

				points.push( { latitude: ( lat / 1E5 ), longitude: ( lng / 1E5 ) } );
			}
		}
		return points;
	}

	const fetchAndRenderRoute = ( props ) => {

		let {
			origin: initialOrigin,
			destination: initialDestination,
			waypoints: initialWaypoints = [],
			apikey,
			onStart,
			onReady,
			onError,
			mode = 'TRANSIT',
			language = 'en',
			optimizeWaypoints,
			splitWaypoints,
			directionsServiceBaseUrl = 'https://maps.googleapis.com/maps/api/directions/json',
			region,
			precision = 'low',
			timePrecision = 'none',
			channel,
			alternatives = true,
		} = props;

		if ( !apikey ) {
			console.warn( `MapViewDirections Error: Missing API Key` ); // eslint-disable-line no-console
			return;
		}

		if ( !initialOrigin || !initialDestination ) {
			return;
		}

		const timePrecisionString = timePrecision === 'none' ? '' : timePrecision;

		// Routes array which we'll be filling.
		// We'll perform a Directions API Request for reach route
		const routes = [];

		// We need to split the waypoints in chunks, in order to not exceede the max waypoint limit
		// ~> Chunk up the waypoints, yielding multiple routes
		if ( splitWaypoints && initialWaypoints && initialWaypoints.length > WAYPOINT_LIMIT ) {
			// Split up waypoints in chunks with chunksize WAYPOINT_LIMIT
			const chunckedWaypoints = initialWaypoints.reduce( ( accumulator, waypoint, index ) => {
				const numChunk = Math.floor( index / WAYPOINT_LIMIT );
				accumulator[numChunk] = [].concat( ( accumulator[numChunk] || [] ), waypoint );
				return accumulator;
			}, [] );

			// Create routes for each chunk, using:
			// - Endpoints of previous chunks as startpoints for the route (except for the first chunk, which uses initialOrigin)
			// - Startpoints of next chunks as endpoints for the route (except for the last chunk, which uses initialDestination)
			for ( let i = 0; i < chunckedWaypoints.length; i++ ) {
				routes.push( {
					waypoints: chunckedWaypoints[i],
					origin: ( i === 0 ) ? initialOrigin : chunckedWaypoints[i - 1][chunckedWaypoints[i - 1].length - 1],
					destination: ( i === chunckedWaypoints.length - 1 ) ? initialDestination : chunckedWaypoints[i + 1][0],
				} );
			}
		}

		// No splitting of the waypoints is requested/needed.
		// ~> Use one single route
		else {
			routes.push( {
				waypoints: initialWaypoints,
				origin: initialOrigin,
				destination: initialDestination,
			} );
		}

		// Perform a Directions API Request for each route
		Promise.all( routes.map( ( route, index ) => {
			let {
				origin,
				destination,
				waypoints,
			} = route;

			if ( origin.latitude && origin.longitude ) {
				origin = `${origin.latitude},${origin.longitude}`;
			}

			if ( destination.latitude && destination.longitude ) {
				destination = `${destination.latitude},${destination.longitude}`;
			}

			waypoints = waypoints
				.map( waypoint => ( waypoint.latitude && waypoint.longitude ) ? `${waypoint.latitude},${waypoint.longitude}` : waypoint )
				.join( '|' );

			if ( optimizeWaypoints ) {
				waypoints = `optimize:true|${waypoints}`;
			}

			if ( index === 0 ) {
				onStart && onStart( {
					origin,
					destination,
					waypoints: initialWaypoints,
				} );
			}

			return (
				fetchRoute( directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language, region, precision, timePrecisionString, channel, alternatives)
					.then( result => {
						return result;
					} )
					.catch( errorMessage => {
						return Promise.reject( errorMessage );
					} )
			);
		} ) ).then( results => {
			// Combine all Directions API Request results into one
			setRoute(results[0]);
		} )
			.catch( errorMessage => {
				resetState();
				console.warn( `MapViewDirections Error: ${errorMessage}` ); // eslint-disable-line no-console
				onError && onError( errorMessage );
			} );
	}

	const fetchRoute = ( directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language, region, precision, timePrecision, channel, alternatives) => {

		// Define the URL to call. Only add default parameters to the URL if it's a string.
		let url = directionsServiceBaseUrl;
		if ( typeof ( directionsServiceBaseUrl ) === 'string' ) {
			url += `?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode.toLowerCase()}&language=${language}&region=${region}&alternatives=${alternatives}`;
			if ( timePrecision ) {
				url += `&departure_time=${timePrecision}`;
			}
			if ( channel ) {
				url += `&channel=${channel}`;
			}
		}

		return fetch( url )
			.then( response => response.json() )
			.then( json => {

				if ( json.status !== 'OK' ) {
					const errorMessage = json.error_message || json.status || 'Unknown error';
					return Promise.reject( errorMessage );
				}

				if ( json.routes.length ) {
					
					const steps = json.routes[0].legs[0].steps;
					const route = steps.map((step) => {
						return {
							distance: step.distance.value,
							duration: step.duration.value,
							coordinates: decode( [{ polyline: step.polyline }] ),
							travel_mode: step.travel_mode,
							transport_desc: step.transit_details?.line?.name,
							transport_num: step.transit_details?.line?.short_name,
							vehicle: step.transit_details?.line?.vehicle?.type,
							color: step.transit_details?.line?.color,
							start_location: step.start_location,
							end_location: step.end_location,
							html_instructions: step.html_instructions,
							departure_stop: step.transit_details?.departure_stop?.name,
							arrival_stop: step.transit_details?.arrival_stop?.name,
						} ;
					})
					const bounds = json.routes[0].bounds;
					console.log("legs");
					console.log(JSON.stringify(route));
					return route;

				} else {
					return Promise.reject();
				}
			} )
			.catch( err => {
				return Promise.reject( `Error on GMAPS route request: ${err}` );
		} );
	}

	const [SearchTab, setSearchTab] = useState(false)

	const expandSearchTab = () => {
		setSearchTab(true);
	}


	const Header = () => {

		return(
			<Div activeOpacity={1.0} auto >
			  <Animated.View style={{height: 1, transform: [{scaleY: AnimatedStyles.animationValue}], alignContent: "center", backgroundColor: "white", borderBottomLeftRadius: 30, borderBottomRightRadius: 30}} >
			  </Animated.View>
			  <Row bgWhite h50 itemsCenter borderBottomLeftRadius={30} borderBottomRightRadius={30} >
				<Col itemsCenter onPress={(e)=> expandSearchTab()}><Span bold>서울대학교</Span></Col>
				<Col auto itemsCenter>
				  <Span>→</Span>
				</Col>
				<Col itemsCenter onPress={(e)=> expandSearchTab()}><Span bold>강남 위워크</Span></Col>
			  </Row>
			  {ExpandHeader[1] && (
				<Row itemsCenter {...ExpandHeader[1]}>
				  <Col>
					{defaultRoute.map((step, index) => {
						return(<Row my15 key={index}>
									<Col mx20>
										<Row>
											<Col auto>
												<Row ><Span bold>{step.html_instructions}</Span></Row>
												{step.transport_num && <Row><Span red>{step.transport_num}</Span></Row>}
											</Col>
											<Col ml5>
												<Row my5>
													{step.travel_mode == "WALKING" ? (
														_.range(1).map((i) => {
															return(<Col mx2 h10 key={i} borderRadius={1} backgroundColor={"grey"}></Col>)
														})
													):
														<Col h10 borderRadius={1} backgroundColor={step.color}></Col>}
												</Row>
												{step.arrival_stop && step.departure_stop &&
													<Row>
														<Col itemsStart auto><Span>{step.arrival_stop}</Span></Col>
														<Col itemsCenter></Col>
														<Col itemsEnd auto><Span>{step.departure_stop}</Span></Col>
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

	const SearchPage = () => {
		return (
			<Div flex={1}>
				<NativeBaseProvider>
					<Div bgWhite px20 pt20 activeOpacity={1.0} auto >
						<Row bgWhite h50  >
							<Col onPress={(e)=> console.log()}>
								<TextField
									placeholder={'출발지'}
									value={""}
									onChangeText={(text) => console.log(text)}
								></TextField>
							</Col>
							<Col auto ml20 justifyCenter onPress={(e)=> console.log()}>
								<Span bold>출발</Span>
							</Col>
						</Row>
						<Row bgWhite h50  >ㄴ
							<Col onPress={(e)=> console.log()}>
								<TextField
									placeholder={'도착지'}
									value={""}
									onChangeText={(text) => console.log(text)}
								></TextField>
							</Col>
							<Col auto justifyCenter ml20 onPress={(e)=> console.log()}>
								<Span bold>도착</Span>
							</Col>
						</Row>
					</Div>
					{ExpandHeader[1] && (
						<Row itemsCenter>
						<Col>
							{defaultRoute.map((step, index) => {
								return(<Row my15 key={index}>
											<Col mx20>
												<Row>
													<Col auto>
														<Row ><Span bold>{step.html_instructions}</Span></Row>
														{step.transport_num && <Row><Span red>{step.transport_num}</Span></Row>}
													</Col>
													<Col ml5>
														<Row my5>
															{step.travel_mode == "WALKING" ? (
																_.range(1).map((i) => {
																	return(<Col mx2 h10 key={i} borderRadius={1} backgroundColor={"grey"}></Col>)
																})
															):
																<Col h10 borderRadius={1} backgroundColor={step.color}></Col>}
														</Row>
														{step.arrival_stop && step.departure_stop &&
															<Row>
																<Col itemsStart auto><Span>{step.arrival_stop}</Span></Col>
																<Col itemsCenter></Col>
																<Col itemsEnd auto><Span>{step.departure_stop}</Span></Col>
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
				</NativeBaseProvider>
			</Div>
		)
	}

  	return (
		<>
			{SearchTab ?
			(<SearchPage></SearchPage>)
			:
			(<Div flex={1}>
				<MapView  
					onPress={(e)=>toggle()}
					provider={PROVIDER_GOOGLE}
					initialRegion={MapCenter} 
					style={StyleSheet.absoluteFill}>
					{/* {Coordinates.map((coordinate, index) =>
					<Marker key={`coordinate_${index}`} coordinate={coordinate} />
					)} */}
					{(Coordinates.length >= 2) && (!isLoading) && (
					<MapViewDirections
						steps={State.steps} origin={State.origin} destination={State.destination}
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
			}
		</>
	)
}


export default LessonScreen;
