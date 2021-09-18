import { useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import React, {useState, useEffect, useRef} from 'react';
import { NativeBaseProvider, TextField } from 'native-base';
import { Div } from 'src/components/common/Div';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import { Span } from 'src/components/common/Span';
import {useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { shallowEqual } from 'react-redux';
import {setUserSearchOrigin, setUserSearchDestination, setSearchResults, setCurrentRouteIndex, confirmCurrentRoute} from 'src/redux/pathReducer';
import { Image } from 'react-native';
import { ScrollView } from 'src/modules/viewComponents';
import { RefreshControl } from 'react-native';
import { ICONS } from 'src/modules/icons';
import { Img } from 'src/components/common/Img';
import { Shuffle, X } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';
import { NAV_NAMES } from 'src/modules/navNames';
import { HAS_NOTCH } from 'src/modules/contants';

const WAYPOINT_LIMIT = 10;

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

interface State {
	steps: Array<Step>
	origin: LatLng
	destination: LatLng
}

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

const SearchScreen = () => {

    const GOOGLE_MAPS_APIKEY = 'AIzaSyAKr85NZ139cK6XvE_UExdhmtfivHiG8qE';
    const { origin, destination} = useSelector(
        (root: RootState) => (root.path.userSearch), shallowEqual
    );
	const apiGET = useReloadGET();
    const {data: searchResults, isLoading: isSearchLoading} = useApiSelector(APIS.paths.fetch);
    const {data: autocompleteResults, isLoading: isAutocompleteLoading} = useApiSelector(APIS.paths.queryAutocomplete);
    const dispatch = useDispatch();
    const [tentativeOrigin, setTentativeOrigin] = useState(origin);
    const [tentativeDestination, setTentativeDestination] = useState(destination);
    const [NONE, ORIGIN, DESINTATION] = [0, 1, 2]
    const [editFocus, setEditfocus] = useState(NONE)

    const originRef = useRef(null)
    const destinationRef = useRef(null)

    const navigation = useNavigation()

    const setCurrentRoute = (index) => {
        dispatch(setCurrentRouteIndex(index))
        setEditfocus(NONE)
        navigation.goBack()
    }
    
    const setOrigin = (origin) => {
        dispatch(setUserSearchOrigin(origin))
    }

    const setDestination = (destination) => {
        dispatch(setUserSearchDestination(destination))
    }

    const onFocus = (which) => [
        setEditfocus(which)
    ]
 
    const onChangeText = (text, which) => {
        if (which == "origin"){
            setTentativeOrigin(text)
        }else{
            setTentativeDestination(text)
        }
        let props = {
            apikey: GOOGLE_MAPS_APIKEY,
            language: 'ko',
            input: text,
        }
        apiGET(APIS.paths.queryAutocomplete(props), (results) =>onReady(results.data), (error) => onError(error))
    }

    const onAutoCompleteSelect = (index) => {
        const autocompleteDescription = autocompleteResults?.predictions[index].description
        const autocompleteTerm = autocompleteResults?.predictions[index].terms[0].value
        if (!autocompleteDescription || !autocompleteTerm) return
        if (editFocus == 2){
            setTentativeDestination(autocompleteTerm)
            setOrigin(tentativeOrigin)
            setEditfocus(NONE)
            destinationRef.current.blur()
        }
        else{
            setTentativeOrigin(autocompleteTerm)
            setDestination(tentativeDestination)
            setEditfocus(NONE)            
            originRef.current.blur()
        }
        fetchAndSetSearchResults(props);
    }

    const onPressExit = () => {
		navigation.navigate(NAV_NAMES.Home)
    }

    const onPressSwitch = () => {
        const d = destination
        const o = origin
        setTentativeOrigin(d)
        setTentativeDestination(o)
        setOrigin(d)
        setDestination(o)
    }

    const waypoints = [];

    const apikey = GOOGLE_MAPS_APIKEY;

    const precision = "high";

    const mode = "TRANSIT";
    
    const language = "ko";

    const alternatives = true;

    const onError = (errorMessage) => {
        resetState()
        console.log('GOT AN ERROR');
    }

    const onStart =  (params) => {
        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
    }

    const onReady = (result) => {
        console.log(JSON.stringify(result))
        console.log("apis alright")
		console.log(`Distance: ${result.distance/10} km`)
		console.log(`Duration: ${result.duration} min.`)
    }

    const props = {
        waypoints: waypoints,
        apikey: apikey,
        precision: precision,
        mode: mode,
        language: language,
        onStart: onStart,
        onReady: onReady,
        onError: onError,
        alternatives: alternatives
    }

	const resetState = () => {
		dispatch(setSearchResults([]));
	}

	const fetchAndSetSearchResults = ( props ) => {
        
		let {
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
			console.warn( `MapDirections Error: Missing API Key` ); // eslint-disable-line no-console
			return;
		}

        if ( !origin || !destination ) {
            console.log("resturednas ")
			return;
		}

		const timePrecisionString = timePrecision === 'none' ? '' : timePrecision;

		// Routes array which we'll be filling.
		// We'll perform a Directions API Request for reach route
		const routes = [];
        console.log("helloheloo")

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
					origin: ( i === 0 ) ? origin : chunckedWaypoints[i - 1][chunckedWaypoints[i - 1].length - 1],
					destination: ( i === chunckedWaypoints.length - 1 ) ? destination : chunckedWaypoints[i + 1][0],
				} );
			}
		}

		// No splitting of the waypoints is requested/needed.
		// ~> Use one single route
		else {
			routes.push( {
				waypoints: initialWaypoints,
				origin: origin,
				destination: destination,
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
				apiGET(APIS.paths.fetch({directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language, region, precision, timePrecisionString, channel, alternatives}), (results) =>onReady(results.data), (error) => onError(error))
			);
		})) 
	}

    const AutoCompleteSuggestions = ({onPress, autoCompleteResults}) => {

        const iconifyResultType = (types) => {
            return(
                <Div rounded100 backgroundColor={"silver"} h30 w30 itemsCenter justifyCenter>
                    {
                        types?.includes("establishment") ?
                        <Img tintColor={"white"} h25 w20 white source={ICONS.iconMapMarker}></Img>
                        :
                        <Img tintColor={"white"} h20 w20 source={ICONS.iconSearch}></Img>
                    }
                </Div>
            )
        }

        return(
            <Div mt10 bgWhite flex={1}>
                <ScrollView
                    flex={1}
                    bgGray100
                    showsVerticalScrollIndicator={false}
                >
                    <Div px20>
                    {
                        autoCompleteResults?.predictions?.map((result, index) => {
                            return (
                                <Row py20 justifyCenter borderBottom borderGray200 key={index} onPress={(e) => onPress(index)}>
                                    <Col justifyCenter mr10 auto>{iconifyResultType(result.types)}</Col>
                                    <Col justifyCenter><Span>{result.terms[0].value}</Span></Col>
                                </Row>
                            )
                        })
                    }
                    </Div>
                </ScrollView>
            </Div>
        )
    }

    return (
        <Div flex={1}>
            <Div h={HAS_NOTCH ? 44 : 20} />
            <NativeBaseProvider>
                <Div bgWhite px20 py10 activeOpacity={1.0} auto >
                    { (!editFocus || editFocus == 1) && <Row bgWhite h50 >
                        <Col auto justifyCenter mr5 >
                            <Span >출발: </Span>
                        </Col>
                        <Col >
                            <TextField
                                ref={originRef}
                                textContentType={"fullStreetAddress"}
                                placeholder={'출발지'}
                                value={tentativeOrigin}
                                onFocus={() => onFocus(ORIGIN)}
                                onChangeText={(text) => onChangeText(text, 'origin')}
                            ></TextField>
                        </Col>
                        {!editFocus && <Col auto ml20 justifyCenter onPress={(e)=> onPressExit()}>
                            <X stroke="#2e2e2e" fill="#fff" width={18} ></X>
                        </Col>}
                    </Row>}
                    {(!editFocus || editFocus == 2) &&<Row bgWhite h50 >
                        <Col auto justifyCenter mr5 >
                            <Span >도착: </Span>
                        </Col>
                        <Col >
                            <TextField
                                ref={destinationRef}
                                placeholder={'도착지'}
                                value={tentativeDestination}
                                onFocus={() => onFocus(DESINTATION)}
                                onChangeText={(text) => onChangeText(text, 'destination')}
                            ></TextField>
                        </Col>
                        {!editFocus && <Col auto justifyCenter ml20 onPress={(e)=> onPressSwitch()}>
                            <Shuffle stroke="#2e2e2e" fill="#fff" width={18} ></Shuffle>
                        </Col>}
                    </Row>}
                </Div>
                {editFocus ?
                    <AutoCompleteSuggestions onPress={onAutoCompleteSelect} autoCompleteResults={autocompleteResults}/>
                :
                    <Div mt10 bgWhite flex={1}>
                        <ScrollView
                            flex={1}
                            bgGray100
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                            <RefreshControl refreshing={isSearchLoading} onRefresh={() => fetchAndSetSearchResults( props )} />
                            }>
                            {searchResults && searchResults.routes.map((result, i) => {
                                return (
                                    <Div borderBottom borderGray200 py20 px20 key={i} onPress={() => setCurrentRoute(i)}>
                                        <Row my10>
                                            <Col auto justifyCenter mr10><Span fontSize={23}>{result.legs[0].duration.text}</Span></Col>
                                            <Col justifyCenter><Span>{`${result.legs[0].departure_time.text} ~ ${result.legs[0].arrival_time.text}`}</Span></Col>
                                        </Row>
                                        <Row mt2 mb10>
                                            <Div flex={3}>
                                                <Row>
                                                    {result.legs[0].steps.map((step, ind)=>{
                                                        return (
                                                            <Div key={ind} mx1 flexDirection={"column"} flex={ step.distance.value / result.legs[0].distance.value} justifyCenter >
                                                                <Div h3 borderRadius={1} backgroundColor={step.transit_details?.line?.color || "silver"}>
                                                                </Div>
                                                            </Div>
                                                        )
                                                    })}
                                                </Row>
                                            </Div>
                                            <Div flex={1}>
                                            </Div>
                                        </Row>
                                        {result.legs[0].steps.filter(step => step.transit_details).map((step, index , arr)=>{

                                            return (
                                                <React.Fragment key={index} >
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
                                                        <Col justifyCenter>
                                                            <Span>{step.transit_details.departure_stop.name}</Span>
                                                        </Col>
                                                    </Row>
                                                    {   
                                                        step.transit_details?.line?.vehicle?.name == "버스" &&
                                                        <Row mb5 justifyCenter >
                                                            <Col w25 auto mr5 itemsCenter justifyCenter>
                                                            </Col>
                                                            <Col justifyCenter mr5 auto>
                                                                <Div itemsCenter justifyCenter backgroundColor={step.transit_details.line.color} borderRadius={5} px5>
                                                                    <Span fontSize={10} white>{step.transit_details.line.name.split(" ").pop().slice(0,2)}</Span>
                                                                </Div>
                                                            </Col>
                                                            <Col justifyCenter auto>
                                                                    <Span >{step.transit_details.line.short_name}</Span>
                                                            </Col>
                                                            <Col></Col>
                                                        </Row>
                                                    }
                                                    {
                                                        arr.length && (arr.length - 1 == index) && 
                                                        <Row my5 fontSize={15} justifyCenter >
                                                            <Col w25 auto mr5 itemsCenter justifyCenter>
                                                                <Div h15 w15 itemsCenter justifyCenter backgroundColor={step.transit_details.line.color} borderRadius={50}>
                                                                    <Div h5 w5 backgroundColor={"white"} borderRadius={10}></Div>
                                                                </Div>
                                                            </Col>
                                                            <Col justifyCenter>
                                                                <Span>{step.transit_details.arrival_stop.name}</Span>
                                                            </Col>
                                                        </Row>
                                                    }
                                                </React.Fragment>
                                            )
                                        })}
                                    </Div>
                                )
                            })}
                        </ScrollView>
                    </Div>
                }
            </NativeBaseProvider>
        </Div>
    )
}

export default SearchScreen;