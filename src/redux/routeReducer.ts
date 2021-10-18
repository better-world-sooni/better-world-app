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
      const newVehicles = action.payload.legs[0].steps.filter((step)=> {return step.transit_details}).map((step, ind) => {
        const line = step.transit_details.line;
        return {
          type: line.vehicle.type,
          name: line.name,
          shortName: line.short_name,
          color: line.color,
          textColor: line.text_color,
        };
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
