import { createSlice } from '@reduxjs/toolkit';
import { postKey } from 'src/modules/utils';

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        mainPosts: null,
        myPosts: null,
        cachedPreup: null,
        globalFiter: '2호선 본선',
        currentPostId: null,
    },
    reducers: {
        setMainPosts: (state, action) => {
            if (action.payload) {
                state.mainPosts = action.payload;
            }
        },
        setMyPosts: (state, action) => {
            if (action.payload) {
                state.myPosts = action.payload;
            }
        },
        setMainPost: (state, action) => {
            const key = postKey(action.payload);
            state.mainPosts[key] = action.payload;
        },
        setMyPost: (state, action) => {
            const key = postKey(action.payload);
            state.myPosts[key] = action.payload;
        },
        setCachedPreup: (state, action) => {
            state.cachedPreup = action.payload;
        },
        setGlobalFilter: (state, action) => {
            state.globalFiter = action.payload;
        },
    },
});

export const feedReducer = feedSlice.reducer;
export const {
    setMainPosts,
    setMyPosts,
    setMainPost,
    setCachedPreup,
    setGlobalFilter,
} = feedSlice.actions;
