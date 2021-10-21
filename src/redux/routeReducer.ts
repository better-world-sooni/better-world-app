import { createSlice } from '@reduxjs/toolkit';

const routeSlice = createSlice({
  name: 'route',
  initialState: {
    userSearch: {
      origin: "",
      destination: ""
    },
    currentRoute: null,
    currentVehicles: [],
    currentRouteConfirmed: true
  },
  reducers: {
    setUserSearchOrigin: (state, action) => {
      state.userSearch.origin = action.payload;
    },
    setUserSearchDestination: (state, action) => {
      state.userSearch.destination = action.payload;
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
export const { setUserSearchOrigin, setUserSearchDestination, setCurrentRoute, confirmCurrentRoute } =
  routeSlice.actions;
