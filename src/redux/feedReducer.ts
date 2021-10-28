import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        posts: [],
        cachedPreup: null,
        globalFiter: '2호선 본선',
    },
    reducers: {
        setPosts: (state, action) => {
            if (action.payload && action.payload.length > 0) {
                // state.posts = [...action.payload].reverse();
                state.posts = action.payload;
            }
        },
        setCachedPreup: (state, action) => {
            state.cachedPreup = action.payload;
        },
        setGlobalFilter: (state, action) => {
            state.globalFiter = action.payload;
        }
    },
});

export const feedReducer = feedSlice.reducer;
export const {
    setPosts,
    setCachedPreup,
    setGlobalFilter,
} = feedSlice.actions;
