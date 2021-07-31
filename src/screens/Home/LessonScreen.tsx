import React, {useState, useEffect, useRef, Fragment, FC, ReactElement} from 'react';
import { Div } from 'src/components/common/Div';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import { Img } from 'src/components/common/Img';
import { IMAGES } from 'src/modules/images';
import { Span } from 'src/components/common/Span';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import { Animated, View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import MapView, { Circle, Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SearchScreen from 'src/screens/SearchScreen'
import _ from "lodash";
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { shallowEqual } from 'react-redux';

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

	const {data: defaultRoute, isLoading} = useApiSelector(APIS.paths.default);
	const apiGET = useReloadGET();
	useEffect(() => {
		apiGET(APIS.paths.default())
	}, []);

	const {steps, originCoord, destinationCoord} = useSelector(
        (root: RootState) => (root.path.currentRoute), shallowEqual
    );

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

  	return (
		<>
			{SearchTab ?
			(<SearchScreen></SearchScreen>)
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
							steps={steps} origin={originCoord} destination={destinationCoord}
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
