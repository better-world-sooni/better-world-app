import {createSlice} from '@reduxjs/toolkit';

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    selectedTutorList: [],
  },
  reducers: {
    setSelectedTutorList: (state, action) => {
      state.selectedTutorList = action.payload;
    },
    addSelectedTutor: (state, action) => {
      state.selectedTutorList.unshift(action.payload);
    },
    deleteSelectedTutor: (state, action) => {
      state.selectedTutorList.splice(action.payload, 1);
    },
  },
});

export const scheduleReducer = scheduleSlice.reducer;
export const {setSelectedTutorList, addSelectedTutor, deleteSelectedTutor} =
  scheduleSlice.actions;
export const scheduleListSelector = state => state.schedule.selectedTutorList;
