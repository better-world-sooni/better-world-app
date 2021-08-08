import { createSlice } from '@reduxjs/toolkit';

const pathSlice = createSlice({
  name: 'path',
  initialState: {
    userSearch: {
      origin: "",
      destination: ""
    },
    searchResults: [],
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
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setCurrentRouteIndex: (state, action) => {
      state.currentRouteIndex = action.payload;
    },
    confirmCurrentRoute: (state, action) => {
      state.currentRouteConfirmed = action.payload;
    },
    addSelectedTutor: (state, action) => {
      state.searchResults.unshift(action.payload);
    },
    deleteSelectedTutor: (state, action) => {
      state.searchResults.splice(action.payload, 1);
    },
  },
});

export const pathReducer = pathSlice.reducer;
export const { setUserSearchOrigin, setUserSearchDestination, setSearchResults, setCurrentRouteIndex, confirmCurrentRoute, addSelectedTutor, deleteSelectedTutor } =
  pathSlice.actions;
export const pathListSelector = state => state.path.selectedTutorList;
