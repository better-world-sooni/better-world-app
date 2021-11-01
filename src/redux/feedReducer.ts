import { createSlice } from '@reduxjs/toolkit';
import { postKey } from 'src/modules/utils';

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        mainPosts: null,
        cachedPreup: null,
        globalFiter: '2호선 본선',
        currentPostId: null,
    },
    reducers: {
        setMainPosts: (state, action) => {
            if (action.payload) {
                // state.posts = [...action.payload].reverse();
                state.mainPosts = action.payload;
            }
        },
        setPost: (state, action) => {
            const key = postKey(action.payload);
            const {[key]: currentPost, ...other} = state.mainPosts;
            state.mainPosts = {[key]: action.payload, ...other};
        },
        setCachedPreup: (state, action) => {
            state.cachedPreup = action.payload;
        },
        setGlobalFilter: (state, action) => {
            state.globalFiter = action.payload;
        },
        setCurrentPostId: (state, action) => {
            state.currentPostId = action.payload;
        }
    },
});

export const feedReducer = feedSlice.reducer;
export const {
    setMainPosts,
    setPost,
    setCachedPreup,
    setGlobalFilter,
    setCurrentPostId,
} = feedSlice.actions;
