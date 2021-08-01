export interface TxtVal {
    text: string;
    value: number;
}
export interface LatLng {
    lat: number,
    lng: number
}

export interface GeocodedWaypoint {
    geocoder_status: string;
    partial_match: boolean;
    place_id: string;
    types: Array<string>;
}

export interface Bounds {
    northeast: LatLng;
    southwest: LatLng;
}

export interface PolylineString {
    points: string;
}

export interface WalkingStep {
    distance: TxtVal;
    duration: TxtVal;
    end_location: LatLng
    polyline: PolylineString,
    start_location: LatLng
    travel_mode: string;
}

export interface Step {
    distance: TxtVal;
    duration: TxtVal;
    end_location: LatLng;
    html_instructions: string;
    polyline: PolylineString;
    start_location: LatLng;
    steps?: Array<WalkingStep>;
    transit_details?: {
        arrival_stop: {
            location: LatLng;
            name: string;
        }
        arrival_time: {
            text: string;
            time_zone: string;
            value: number;
        }
        departure_stop: {
            location: {
                location: LatLng;
                name: string;
            }
            name: string;
        }
        departure_time: {
            text: string;
            time_zone: string;
            value: number;
        }
        headsign: string;
        headway: number;
        line: {
            agencies: [
                {
                    name: string;
                    url: string;
                }
            ],
            color: string;
            name: string;
            short_name: string;
            text_color: string;
            vehicle: {
                icon: string;
                name: string;
                type: string;
            }
        }
        num_stops: number;
    }
    travel_mode: string;
}

export interface Leg {
    arrival_time: {
        text: string;
        time_zone: string;
        value: number;
    },
    departure_time: {
        text: string;
        time_zone: string;
        value: number;
    },
    distance: {
        text: string;
        value: number;
    },
    duration: {
        text: string;
        value: number;
    },
    end_address: string;
    end_location: LatLng;
    start_address: string;
    start_location: LatLng;
    steps: Array<Step>;
    traffic_speed_entry: Array<any>;
    via_waypoint: Array<any>;
}

export interface Route {
    bounds: Bounds;
    copyrights: string;
    legs: Array<Leg>;
    overview_polyline: PolylineString;
    summary: string;
    warnings: Array<string>;
    waypoint_order: Array<any>
}

export interface SearchResult {
    geocoded_waypoints: Array<GeocodedWaypoint>;
    routes: Array<Route>;
    status: string;
}