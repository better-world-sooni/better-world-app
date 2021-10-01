import { createSlice } from '@reduxjs/toolkit';

const pathSlice = createSlice({
  name: 'path',
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

export const pathReducer = pathSlice.reducer;
export const { setUserSearchOrigin, setUserSearchDestination, setCurrentRouteIndex, confirmCurrentRoute } =
  pathSlice.actions;
export const pathListSelector = state => state.path.selectedTutorList;
