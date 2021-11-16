import { createSlice } from '@reduxjs/toolkit';
import { Direction } from 'src/modules/constants';
import { stationArr } from 'src/modules/utils';

const routeSlice = createSlice({
  name: 'route',
  initialState: {
    route: {
      origin: null,
      destination: null,
      direction: null,
      stations: [],
    },
    selectedTrain: null,
    trainPositions: null,
    arrivalTrain: null,
    receiveStationPush: false,
    currentRoute: null,
    currentVehicles: [],
    currentRouteConfirmed: true
  },
  reducers: {
    setOrigin: (state, action) => {
      state.route.origin = action.payload;
      if(state.route.origin && state.route.destination){
        const innerCircle = stationArr([], state.route.origin, state.route.destination, Direction.INNER);
        const outerCircle = stationArr([], state.route.origin, state.route.destination, Direction.OUTER);
        if (innerCircle.length < outerCircle.length ){
          state.route.direction = Direction.INNER;
          state.route.stations = innerCircle;
        }else {
          state.route.direction = Direction.OUTER;
          state.route.stations = outerCircle;
        } 
      } else{
        state.route.stations = []
        state.route.direction = null
      }
    },
    setDestination: (state, action) => {
      state.route.destination = action.payload;
      if(state.route.origin && state.route.destination){
        const innerCircle = stationArr([], state.route.origin, state.route.destination, Direction.INNER);
        const outerCircle = stationArr([], state.route.origin, state.route.destination, Direction.OUTER);
        if (innerCircle.length < outerCircle.length ){
          state.route.direction = Direction.INNER;
          state.route.stations = innerCircle;
        }else {
          state.route.direction = Direction.OUTER;
          state.route.stations = outerCircle;
        } 
      } else{
        state.route.stations = [];
        state.route.direction = null;
      }
    },
    setDirection: (state, action) => {
      state.route.direction = action.payload;
      if (state.route.origin && state.route.destination && action.payload){
        state.route.stations = stationArr([], state.route.origin, state.route.destination, action.payload);
      } else{
        state.route.stations = [];
      }
    },
    exchangeOriginDestination: (state) => {
      if(state.route.origin && state.route.destination){
        const prevOrigin= state.route.origin;
        const prevDestination= state.route.destination;
        const nextDirection = state.route.direction == Direction.INNER ? Direction.OUTER : Direction.INNER;
        const stations = stationArr([], prevDestination, prevOrigin, nextDirection);
        state.route.origin = prevDestination;
        state.route.destination = prevOrigin;
        state.route.direction = nextDirection;
        state.route.stations = stations;
      } 
    },
    setSelectedTrain: (state, action) => {
      state.selectedTrain = action.payload
    },
    setArrivalTrain: (state,action) => {
      state.arrivalTrain = action.payload
    },
    setRoute: (state, action) => {
      if(action.payload){
        state.route = action.payload
      }
    },
    toggleReceiveStationPush: (state) => {
      state.receiveStationPush = !state.receiveStationPush
    },
    setTrainPositions: (state, action) => {
      state.trainPositions = action.payload
    },
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
      const newVehicles = action.payload.legs[0].steps.map((step, ind) => {
        const line = step?.transit_details?.line;
        if(line){
          return {
            type: line.vehicle.type,
            name: line.name,
            shortName: line.short_name,
            color: line.color,
            textColor: line.text_color,
            htmlInstructions: step.html_instructions,
            departureStop: step.transit_details.departure_stop.name,
            arrivalStop: step.transit_details.arrival_stop.name,
          };
        } else {
          return {
            type: "WALKING",
            htmlInstructions: step.html_instructions,
          };
        }
        
      })
      state.currentVehicles = newVehicles;
    },
    confirmCurrentRoute: (state, action) => {
      state.currentRouteConfirmed = action.payload;
    },
  },
});

export const routeReducer = routeSlice.reducer;
export const { setOrigin, setDestination, setDirection, setRoute, setSelectedTrain, setTrainPositions, exchangeOriginDestination, toggleReceiveStationPush, setArrivalTrain, setCurrentRoute, confirmCurrentRoute } =
  routeSlice.actions;
