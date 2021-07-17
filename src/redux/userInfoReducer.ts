import {createSlice} from '@reduxjs/toolkit';

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    userInfo: {
      first_name: '',
      is_public: false,
      job: null,
      last_name: '',
      lesson_purposes: [],
      step: 1,
      userabouts: [],
      video_url: '',
    },
  },
  reducers: {
    setUserInfo: (state, action) => {
      if (action.payload) {
        state.userInfo = action.payload;
      }
    },
    setNames: (state, action) => {
      console.log(action);
      state.userInfo = {
        ...state.userInfo,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        step: action.payload.step,
      };
    },
    setInfoJob: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        job: action.payload,
        step: 3,
      };
    },
    setLessonPurposes: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        lesson_purposes: action.payload,
        step: 4,
      };
    },
    setMyAbouts: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        userabouts: action.payload,
        step: 5,
      };
    },
    setProfileVideoUrl: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        video_url: action.payload,
        step: 6,
      };
    },
  },
});

export const userInfoReducer = userInfoSlice.reducer;
export const {
  setUserInfo,
  setNames,
  setInfoJob,
  setLessonPurposes,
  setMyAbouts,
  setProfileVideoUrl,
} = userInfoSlice.actions;
export const userInfoSelector = state => state.userInfo.userInfo;
