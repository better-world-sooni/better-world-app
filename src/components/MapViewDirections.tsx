import React, {useRef, Fragment} from 'react';
import {Circle, Polyline, Marker} from 'react-native-maps';
import isEqual from 'lodash.isequal';
import { IMAGES } from 'src/modules/images';
import { Img } from 'src/components/common/Img';

const WAYPOINT_LIMIT = 10;

interface Props {
    origin: string;
	destination: string;
	waypoints?: string;
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
}

interface LatLng {
	latitude: number,
	longitude: number
}

interface State {
	steps: Array<Step>
	origin: LatLng
	destination: LatLng
}

class MapViewDirections extends React.Component<Props, State> {

	constructor( props ) {
		super( props );

		this.state = {
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
			}],
			origin: {latitude: 0, longitude: 0},
			destination: {latitude: 0, longitude: 0}
		};
	}

	componentDidMount() {
		this.fetchAndRenderRoute( this.props );
	}

	componentDidUpdate( prevProps ) {
		if ( !isEqual( prevProps.origin, this.props.origin ) || !isEqual( prevProps.destination, this.props.destination ) || !isEqual( prevProps.waypoints, this.props.waypoints ) || !isEqual( prevProps.mode, this.props.mode ) || !isEqual( prevProps.precision, this.props.precision ) || !isEqual( prevProps.splitWaypoints, this.props.splitWaypoints ) ) {
			if ( this.props.resetOnChange === false ) {
				this.fetchAndRenderRoute( this.props );
			} else {
				this.resetState( () => {
					this.fetchAndRenderRoute( this.props );
				} );
			}
		}
	}

	resetState = ( cb = null ) => {
		this.setState( {
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
			}],
		origin: {latitude: 0, longitude: 0},
		destination: {latitude: 0, longitude: 0}
		}, cb );
	}

	decode( t ) {
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

	fetchAndRenderRoute = ( props ) => {

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
				this.fetchRoute( directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language, region, precision, timePrecisionString, channel, alternatives)
					.then( result => {
						return result;
					} )
					.catch( errorMessage => {
						return Promise.reject( errorMessage );
					} )
			);
		} ) ).then( results => {
			// Combine all Directions API Request results into one
			const route = results[0].map((item) => item._W)
			const start_location = route[0].start_location
			const end_location = route[route.length-1].end_location
			// Plot it out and call the onReady callback
			this.setState( 
				{steps: route,
				origin: {latitude: start_location.lat, longitude: start_location.lng},
				destination: {latitude: end_location.lat, longitude: end_location.lng},
				}, function () {
				if ( onReady ) {
					onReady( route );
				}
			} );
		} )
			.catch( errorMessage => {
				this.resetState();
				console.warn( `MapViewDirections Error: ${errorMessage}` ); // eslint-disable-line no-console
				onError && onError( errorMessage );
			} );
	}

	fetchRoute( directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language, region, precision, timePrecision, channel, alternatives) {

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

				// console.log( json )
				// console.log( json.routes[0].legs )
				// [
				// 	{"bounds": 
				// 		{"northeast": [Object], 
				// 		"southwest": [Object]}, 
				// 	"copyrights": "Map data ©2021 SK telecom", 
				// 	"legs": [[Object]], 
				// 	"overview_polyline": 
				// 		{"points": "evrcFw|yeWiB|BsNvBkFyAmCo@m@OWLQTwFj@yLvAsGXm@qASYaFqKgAwA_BkA_AWoEwAiHiB_AQwAOeBI[?w@AoAJmH`AkMtAy@DaBGgJw@{ACsALHaA\\yApDyMtGgUtFkRjAsDnEcPtA{EJk@`@gCVuD?wDIaBa@}CwA_J[eBUeBa@_EWsD[uGKgKB_EJ{CHeABsCd@wH?kAs@mEq@kCa@eA}AuDqD}ImBeFeAwDuBaJaFcT_BkIIu@g@}HQ}BkAcH_@yAo@{AaAwAq@o@iAs@m@WiAWkEc@aMiA_Jy@iC[i@KaA_@yA}@q@_ASg@s@wCiAqF}Ieb@y@sEuAcGuIeb@uF_XgCmMxCK~Ew@"}, 
				// 	"summary": "", 
				// 	"warnings": [
				// 		"Walking directions are in beta. Use caution – This route may be missing sidewalks or pedestrian paths."
				// 	],
				// 	"waypoint_order": []
				// 	}
				// ]
				// console.log( "json.routes[0].legs[0].steps" )
				// console.log( json.routes[0].legs[0].steps )

				// [
				// 	//0
				// 	{
				// 		"distance": { "text": "80 m", "value": 80 },
				// 		"duration": { "text": "1 min", "value": 81 },
				// 		"end_location": { "lat": 37.45704, "lng": 126.94941 },
				// 		"html_instructions": "Walk to College of Agriculture and Life Sciences",
				// 		"polyline": { "points": "evrcFw|yeWiB|B" },
				// 		"start_location": { "lat": 37.4565095, "lng": 126.9500385 },
				// 		"steps": [[Object]], "travel_mode": "WALKING"
				// 	},
				// 	//1
				// 	{
				// 		"distance": { "text": "2.8 km", "value": 2779 },
				// 		"duration": { "text": "9 mins", "value": 529 },
				// 		"end_location": { "lat": 37.480317, "lng": 126.952777 },
				// 		"html_instructions": "Bus towards 중앙대",
				// 		"polyline": { "points": "oyrcFyxyeW}MnBUFuBi@uBo@gBa@e@Mm@OWLQTwFj@kHz@mCZsGXm@qAQUACiCoFwAaDgAwA_BkA}@UAA_Cu@oAa@iHiB_AQm@Gi@GmAGWAY?A?w@AoAJgH~@E@mEb@}Fp@w@DA?a@C_ACeJw@A?@A" },
				// 		"start_location": { "lat": 37.45704, "lng": 126.94941 },
				// 		"transit_details": {
				// 			"arrival_stop": [Object],
				// 			"arrival_time": [Object],
				// 			"departure_stop": [Object],
				// 			"departure_time": [Object],
				// 			"headsign": "중앙대",
				// 			"headway": 780,
				// 			"line": [Object],
				// 			"num_stops": 9
				// 		},
				// 		"travel_mode": "TRANSIT"
				// 	},
				// 	//2
				// 	{
				// 		"distance": { "text": "0.1 km", "value": 100 },
				// 		"duration": { "text": "2 mins", "value": 101 },
				// 		"end_location": { "lat": 37.48122, "lng": 126.952728 },
				// 		"html_instructions": "Walk to Seoul Nat‘l Univ. (Gwanak-gu Office)",
				// 		"polyline": { "points": "_kwcF{mzeW}AAuAJ" },
				// 		"start_location": { "lat": 37.480317, "lng": 126.952777 },
				// 		"steps": [[Object], [Object], [Object], [Object], [Object]],
				// 		"travel_mode": "WALKING"
				// 	},
				// 	//3 
				// 	{
				// 		"distance": { "text": "7.8 km", "value": 7821 },
				// 		"duration": { "text": "14 mins", "value": 840 },
				// 		"end_location": { "lat": 37.49795, "lng": 127.027637 },
				// 		"html_instructions": "Subway towards 234",
				// 		"polyline": { "points": "spwcFqmzeW@@HaA\\yAv@oCxBiIpBeHbDaLlCgJfBcGjAsDhB{GdBgGtA{EJk@Ny@PmAJoAJeB@eAAqBIaBa@}Cm@uDi@iD[eBUeBa@_EWsDSsDGaBG_ECgEB_EJ{CHeABsCd@wH@c@Ag@Io@i@}Cq@kCa@eAq@eBk@oAwAmDyAoDqAgD[}@I[{@{Cu@gD_AyDoBoIqBsIu@{Di@oC?AIs@OyBWcEQ}BkAcHMk@Qm@Um@Ym@a@q@_@e@q@o@iAs@m@WiAWgCWcAKoEa@qFg@yD[eD]iAK_AOi@KaA_@w@a@a@[[_@U_@Sg@s@wCgAqFA?}DeR_D_Oy@sEuAcGcC{LqEiTcBcIqC{MgCkM?A?A" },
				// 		"start_location": { "lat": 37.48122, "lng": 126.952728 },
				// 		"transit_details": {
				// 			"arrival_stop": [Object],
				// 			"arrival_time": [Object],
				// 			"departure_stop": [Object],
				// 			"departure_time": [Object],
				// 			"headsign": "234",
				// 			"line": [Object],
				// 			"num_stops": 6
				// 		},
				// 		"travel_mode": "TRANSIT"
				// 	},
				// 	//4
				// 	{
				// 		"distance": { "text": "0.2 km", "value": 211 },
				// 		"duration": { "text": "4 mins", "value": 213 },
				// 		"end_location": { "lat": 37.4960607, "lng": 127.0279746 },
				// 		"html_instructions": "Walk to 373 Gangnam-daero, Seocho-dong, Seocho-gu, Seoul, South Korea",
				// 		"polyline": { "points": "eyzcFwaifWxCI~Ew@" },
				// 		"start_location": { "lat": 37.49795, "lng": 127.027637 },
				// 		"steps": [[Object], [Object], [Object], [Object]],
				// 		"travel_mode": "WALKING"
				// 	}]
				console.log( "json.routes[0].legs[0].steps[1].transit_details" )
				console.log( json.routes[0].legs[0].steps[1].transit_details )



				if ( json.status !== 'OK' ) {
					const errorMessage = json.error_message || json.status || 'Unknown error';
					return Promise.reject( errorMessage );
				}

				if ( json.routes.length ) {

					const steps = json.routes[0].legs[0].steps;
					console.log(json.routes[0].legs[0].steps[3])
					const route = steps.map((step) => {
						return Promise.resolve( {
							distance: step.distance.value,
							duration: step.duration.value,
							coordinates: this.decode( [{ polyline: step.polyline }] ),
							travel_mode: step.travel_mode,
							transport_desc: step.transit_details?.line?.name,
							transport_num: step.transit_details?.line?.short_name,
							vehicle: step.transit_details?.line?.vehicle?.type,
							color: step.transit_details?.line?.color,
							start_location: step.start_location,
							end_location: step.end_location
						} );
					})
					
					return route;

				} else {
					return Promise.reject();
				}
			} )
			.catch( err => {
				return Promise.reject( `Error on GMAPS route request: ${err}` );
			} );
	}

	render() {
		const { steps: Steps, origin: Origin, destination: Destination } = this.state;

		if ( !Steps ) {
			return null;
		}
		const {
			origin, // eslint-disable-line no-unused-vars
			waypoints, // eslint-disable-line no-unused-vars
			splitWaypoints, // eslint-disable-line no-unused-vars
			destination, // eslint-disable-line no-unused-vars
			apikey, // eslint-disable-line no-unused-vars
			onReady, // eslint-disable-line no-unused-vars
			onError, // eslint-disable-line no-unused-vars
			mode, // eslint-disable-line no-unused-vars
			language, // eslint-disable-line no-unused-vars
			region, // eslint-disable-line no-unused-vars
			precision,  // eslint-disable-line no-unused-vars
			...props
		} = this.props;

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
					strokeColor: "#33b8ff",
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

}

export default MapViewDirections;
