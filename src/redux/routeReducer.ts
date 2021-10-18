import { createSlice } from '@reduxjs/toolkit';

const routeSlice = createSlice({
  name: 'route',
  initialState: {
    userSearch: {
      origin: "",
      destination: ""
    },
    currentRouteIndex: false,
    currentRouteConfirmed: true
  },
  reducers: {
    setUserSearchOrigin: (state, action) => {
      state.userSearch.origin = action.payload;
    },
    setUserSearchDestination: (state, action) => {
      state.userSearch.destination = action.payload;
    },
    setCurrentRouteIndex: (state, action) => {
      state.currentRouteIndex = action.payload;
    },
    confirmCurrentRoute: (state, action) => {
      state.currentRouteConfirmed = action.payload;
    },
  },
});

export const routeReducer = routeSlice.reducer;
export const { setUserSearchOrigin, setUserSearchDestination, setCurrentRouteIndex, confirmCurrentRoute } =
  routeSlice.actions;
