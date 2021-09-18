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
	// const { bounds, copyrights, legs, overview_polyline, summary, warnings, waypoint_order, } = props.route
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
				travel_mode: step.travel_mode,
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
		if (step.travel_mode == "WALKING"){
			return {
				lineCap: 'round',
				lineWidth: white ? 10 : 6,
				lineColor: white ? "white" : "grey",
				lineDasharray: [10,10],
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
		icon: {
		  iconImage: ['get', 'icon'], 
		  iconSize: [
			'match',
			['get', 'icon'],
			'example',
			0.3,
			'airport-15',
			0.3,
			/* default */ 1,
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

	const pointShape = (coordinates, id) => {
		return {
			'type': 'FeatureCollection',
			'features': [
				{
				  type: 'Feature',
				  id: `9d10456e-bdda-4aa9-9269-04c1667d4552${id}`,
				  properties: {
					icon: 'example',
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
			{Origin && <MapboxGL.MarkerView id={"destination"} coordinate={Origin}>
				<Div>
					<Row p5 rounded30>
						<Img source={IMAGES.blueMapMarker} h={30*84/60} w30></Img>
					</Row>
					<Row h45>
					</Row>
				</Div>
			</MapboxGL.MarkerView>}
			{DecodedPolylines.map( (step, index) => {
					return (
					<Fragment key={index}>
						<PatternedPolyline step={step} index={index}/>
						{/* <MapboxGL.Images
							nativeAssetImages={[`stop${index}`]}
							//@ts-ignore
							images={{ example: `https:${step.circleImage}`}}
						/>
						{
						step.coordinates.coordinates && 
						<MapboxGL.ShapeSource 
							id={`circle${index}`} 
							//@ts-ignore
							shape={pointShape(step.coordinates.coordinates[0], index)}>
							<MapboxGL.CircleLayer
								id={`circleFill${index}`}
								aboveLayerId={`linelayer${index}`} 
								//@ts-ignore
								style={styles.circles(step.color)} />
							<MapboxGL.SymbolLayer 
								id={`circleIcon${index}`}
								aboveLayerId={`circleFill${index}`}
								//@ts-ignore
							style={styles.icon} />
						</MapboxGL.ShapeSource>
						} */}
					</Fragment>				
					)
			})}
			{Destination && <MapboxGL.MarkerView id={"destination"} coordinate={Destination}>
				<Div>
					<Row p5 rounded30>
						<Img source={IMAGES.redMapMarker} h={30*84/60} w30></Img>
					</Row>
					<Row h45>
					</Row>
				</Div>
			</MapboxGL.MarkerView>}
		</>
	);
}

export default MapViewDirections;