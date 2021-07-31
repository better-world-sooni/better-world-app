import { createSlice } from '@reduxjs/toolkit';

const pathSlice = createSlice({
  name: 'path',
  initialState: {
    userSearch: {
      origin: "",
      destination: ""
    },
    searchResults: [{
      steps: [],
      originCoord: {
        latitude: 37.517235,
        longitude: 127.047325,
      },
      destinationCoord: {
        latitude: 37.5317,
        longitude: 127.0303,
      }
    }],
    currentRoute: {
      steps: [],
      originCoord: {
        latitude: 37.517235,
        longitude: 127.047325,
      },
      destinationCoord: {
        latitude: 37.5317,
        longitude: 127.0303,
      }
    }
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
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
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
export const { setUserSearchOrigin, setUserSearchDestination, setSearchResults, setCurrentRoute, addSelectedTutor, deleteSelectedTutor } =
  pathSlice.actions;
export const pathListSelector = state => state.path.selectedTutorList;
