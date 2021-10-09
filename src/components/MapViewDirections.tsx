import { Circle, Polyline, Marker } from 'react-native-maps';
import React, {useRef, Fragment, FC, ReactElement} from 'react';
import {Route} from 'src/components/types/MapDirectionsTypes'
import MapboxGL from '@react-native-mapbox-gl/maps';
import polyline from '@mapbox/polyline'
import { Div } from './common/Div';
import { IMAGES } from 'src/modules/images';
import { Span } from './common/Span';
import { MapPin } from 'react-native-feather';
import { Row } from './common/Row';
import { Img } from './common/Img';

interface MapViewDirectionsProps {
	route: Route;
}

const MapViewDirections: FC<MapViewDirectionsProps> = (props): ReactElement => {
	const legs = props.route.legs
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
				// coordinates: decode( [{ polyline: step.polyline }] ),
				coordinates: polyline.toGeoJSON(step.polyline.points),
				travelMode: step.travel_mode == "WALKING" ? "walking" : step.transit_details?.line.vehicle?.type.toLowerCase(),
                color: step.transit_details?.line?.color,
				circleImage: step.transit_details?.line.vehicle?.icon
			}
		}
		else {
			return null
		}
	})

	const Origin = [
		start_location.lng,
		start_location.lat,
	]

	const Destination = [
		end_location.lng,
		end_location.lat,
	]

	const polylineConditionalProps = (step, white?) => {
		if (step.travelMode == "walking"){
			return {
				lineCap: 'round',
				lineWidth: white ? 10 : 6,
				lineColor: white ? "white" : "grey",
				lineDasharray: [0,1],
				lineMiterLimit: 1,
			}
		}
		else{
			return {
				lineCap: 'round',
				lineWidth: white ? 10 : 6,
				lineColor: white ? "white" : step.color,
				lineMiterLimit: 1,
			}
		}
	}

	const styles = {
		bus: {
		  iconImage: ['get', 'icon'], 
		  iconSize: [
			'match',
			['get', 'icon'],
			'bus',
			0.03,
			'airport-15',
			0.03,
			1,
		  ],
		},
		subway: {
			iconImage: ['get', 'icon'], 
			iconSize: [
				'match',
				['get', 'icon'],
				'subway',
				0.03,
				'airport-15',
				0.03,
				1,
			],
		},
		walking: {
			iconImage: ['get', 'icon'], 
			iconSize: [
				'match',
				['get', 'icon'],
				'walking',
				0.03,
				'airport-15',
				0.03,
				 1,
			],
		},
		origin: {
			iconImage: ['get', 'icon'], 
			iconSize: [
				'match',
				['get', 'icon'],
				'origin',
				0.5,
				'airport-15',
				0.5,
				 1,
			],
		},
		destination: {
			iconImage: ['get', 'icon'], 
			iconSize: [
				'match',
				['get', 'icon'],
				'destination',
				0.5,
				'airport-15',
				0.5,
				 1,
			],
		},
		circles: (color) => { 
			return {
			visibility: 'visible',
			circleRadius: 8,
			circleColor: color || "grey",
			circleStrokeColor: "white",
			circleStrokeWidth: 1,
			circleOpacity: 1.0,
		  }
		},
	};

	const pointShape = (coordinates, id, iconName) => {
		return {
			'type': 'FeatureCollection',
			'features': [
				{
				  type: 'Feature',
				  id: `9d10456e-bdda-4aa9-9269-04c1667d4552${id}`,
				  properties: {
					icon: iconName,
				  },
				  geometry: {
					type: 'Point',
					coordinates: coordinates,
				  },
				},
			  ]
		};
	}

	const PatternedPolyline = ({step, index}) => {
		return(
			<MapboxGL.ShapeSource id={`line${index}`} shape={step.coordinates}>
				<MapboxGL.LineLayer 
				id={`linelayer${index}White`} 
				belowLayerID={`circleFill${index}`}
				//@ts-ignore
				style={polylineConditionalProps(step, true)} />
				<MapboxGL.LineLayer 
				id={`linelayer${index}`} 
				aboveLayerID={`linelayer${index}White`}
				//@ts-ignore
				style={polylineConditionalProps(step, false)} />
			</MapboxGL.ShapeSource>
		)
	}

 	return (
		<>
			<MapboxGL.Images
				images={{
					//@ts-ignore
					origin: require('../../assets/images/blueMapMarker.png'),
					destination: require('../../assets/images/redMapMarker.png'),
					bus: require('../../assets/icons/bus.png'),
					subway: require('../../assets/icons/subway.png'),
					walking: require('../../assets/icons/walking.png'),
				}}
			/>
			{DecodedPolylines.map( (step, index) => {
				return (
				<Fragment key={index}>
					<MapboxGL.ShapeSource 
						id={`circle${index}`} 
						//@ts-ignore
						shape={pointShape(step.coordinates.coordinates[0], index, step.travelMode)}>
						<MapboxGL.CircleLayer
							id={`circleFill${index}`}
							//@ts-ignore
							style={styles.circles(step.color)} />
						<MapboxGL.SymbolLayer 
							id={`circleIcon${index}`}
							//@ts-ignore
						style={styles[step.travelMode]} />
					</MapboxGL.ShapeSource>
					<PatternedPolyline step={step} index={index}/>
				</Fragment>				
				)
			})}
			{Origin && <MapboxGL.ShapeSource 
							id={`origin`} 
							//@ts-ignore
							shape={pointShape(Origin, 0, "origin")}>
							<MapboxGL.SymbolLayer 
								id={`originIcon`}
								//@ts-ignore
							style={styles.origin} />
						</MapboxGL.ShapeSource>}
			{Destination && <MapboxGL.ShapeSource 
				id={`destination`} 
				//@ts-ignore
				shape={pointShape(Destination, 0, "destination")}>
				<MapboxGL.SymbolLayer 
					id={`destinationIcon`}
					// aboveLayerID={`originIcon`}
					//@ts-ignore
				style={styles.destination} />
			</MapboxGL.ShapeSource>}
			
		</>
	);
}

export default MapViewDirections;