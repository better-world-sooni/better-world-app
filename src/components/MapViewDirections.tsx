import { Circle, Polyline, Marker } from 'react-native-maps';
import React, {useRef, Fragment, FC, ReactElement} from 'react';
import {Route} from 'src/components/types/MapDirectionsTypes'

interface MapViewDirectionsProps {
	route: Route;
}

const MapViewDirections: FC<MapViewDirectionsProps> = (props): ReactElement => {
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
	const { bounds, copyrights, legs, overview_polyline, summary, warnings, waypoint_order, } = props.route
	const {
		arrival_time,
		departure_time,
		distance,
		duration,
		end_address,
		end_location,
		start_address,
		start_location,
		steps,
		traffic_speed_entry,
		via_waypoint,
	} = legs[0]

	const DecodedPolylines = steps.map((step) => {
		if (step.polyline){
			return {
				coordinates: decode( [{ polyline: step.polyline }] ),
				travel_mode: step.travel_mode,
                color: step?.transit_details?.line?.color
			}
		}
		else {
			return null
		}
	})

	const Origin = {
		latitude: start_location.lat,
		longitude: start_location.lng,
	}

	const Destination = {
		latitude: end_location.lat,
		longitude: end_location.lng,
	}

	const CircleFix = ({step}) => {
		const circleRef = useRef(null);
		return(
			step.coordinates &&
				<Circle 
					onLayout={() => (circleRef.current.setNativeProps({
						strokeColor: "silver",
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
				strokeWidth: 6,
				strokeColor: "grey",
				// strokeColor: "#33b8ff",
				lineDashPattern: [10,10]
			}
		}
		else{
			return {
				strokeWidth: 6,
				strokeColor: step.color,
			}
		}
	}

	const PatternedPolyline = ({step}) => {
		return(
			<>
				<Polyline miterLimit={90} tappable lineJoin={'miter'} coordinates={step.coordinates} strokeWidth={9} strokeColor={"white"} />
				<Polyline miterLimit={90} tappable lineJoin={'miter'} coordinates={step.coordinates} {...polylineConditionalProps(step)} />
			</>
		)
	}
	
	return (
		<>
		{Origin && <Marker title={"출발"} pinColor={"blue"} coordinate={Origin}></Marker>}
		{DecodedPolylines.map( (step, index) => {
				return (
				<Fragment key={index}>
					{step.coordinates && (index == 0) && <CircleFix step={{coordinates: [step.coordinates[0]]}}/>}
					<PatternedPolyline step={step}/>
					<CircleFix step={step}/>
				</Fragment>)
		})}
		{Destination && <Marker title={"도착"} coordinate={Destination}></Marker>}
		</>
	);
}

export default MapViewDirections;